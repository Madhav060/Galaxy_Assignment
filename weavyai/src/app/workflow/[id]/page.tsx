"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  ChevronLeft,
  ChevronRight,
  MousePointer,
  Hand,
  Undo,
  Redo,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Bot,
  Play,
  Download,
} from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";
import TextNode from "@/components/nodes/TextNode";
import ImageNode from "@/components/nodes/ImageNode";
import LLMNode from "@/components/nodes/LLMNode";

const nodeTypes = {
  text: TextNode,
  image: ImageNode,
  llm: LLMNode,
};

function WorkflowCanvas({ onNodeAdded, interactionMode }: { onNodeAdded?: () => void; interactionMode: 'select' | 'pan' }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setNodes,
    setEdges,
    undo,
    redo,
    saveToHistory,
    deleteSelected,
    deleteEdge,
  } = useWorkflowStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key - delete selected nodes/edges
      if (e.key === "Delete" || e.key === "Backspace") {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return; // Don't delete if typing in input
        }
        deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      addNode(type, position);
      onNodeAdded?.();
    },
    [reactFlowInstance, addNode, onNodeAdded]
  );

  const onNodeDragStart = () => {
    setIsDragging(true);
  };

  const onNodeDragStop = () => {
    setIsDragging(false);
    saveToHistory();
  };

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStart={onNodeDragStart}
        onNodeDragStop={onNodeDragStop}
        onEdgeClick={(event, edge) => {
          // Delete edge on click (with confirmation)
          if (window.confirm("Delete this connection?")) {
            deleteEdge(edge.id);
          }
        }}
        nodeTypes={nodeTypes}
        fitView
        className="bg-[#2a2a2a]"
        connectionLineStyle={{ stroke: "#9333ea", strokeWidth: 2 }}
        defaultEdgeOptions={{
          style: { stroke: "#9333ea", strokeWidth: 2 },
          animated: true,
          deletable: true,
        }}
        deleteKeyCode={null} // Disable default delete, we handle it ourselves
        isValidConnection={(connection) => {
          // Prevent image nodes from connecting to text inputs (system_prompt and user_message)
          if (!connection.source || !connection.target || !connection.targetHandle) {
            return false;
          }

          const sourceNode = nodes.find((n) => n.id === connection.source);
          if (!sourceNode) return false;

          // If target handle is system_prompt or user_message, only allow text nodes or LLM nodes (not image nodes)
          if (connection.targetHandle === "system_prompt" || connection.targetHandle === "user_message") {
            // Allow text nodes and LLM nodes (with text output)
            if (sourceNode.type === "text") {
              return true;
            }
            if (sourceNode.type === "llm") {
              // Allow LLM nodes only if they have text output (not image output)
              const output = sourceNode.data?.output;
              if (output && typeof output === "string") {
                const isImageOutput = output.startsWith("data:image/") || output.match(/^data:image\//);
                return !isImageOutput; // Only allow if it's NOT an image output
              }
              return true; // Allow if no output yet (will be validated later)
            }
            // Block image nodes
            if (sourceNode.type === "image") {
              return false;
            }
          }

          // Allow all other connections
          return true;
        }}
        panOnScroll={true}
        panOnDrag={interactionMode === 'pan' ? true : false} // Allow panning with left mouse when in pan mode
        nodesDraggable={interactionMode === 'select'} // Only allow node dragging in select mode
        zoomOnScroll={true}
        zoomOnPinch={true}
        onEdgesDelete={(edgesToDelete) => {
          edgesToDelete.forEach((edge) => {
            if (edge.id) {
              deleteEdge(edge.id);
            }
          });
        }}
      >
        <Background color="#3a3a3a" gap={16} size={1} />
        <Controls className="bg-gray-800 border-gray-700" />
        <MiniMap
          className="bg-gray-800 border-gray-700"
          nodeColor="#f7f7ad"
          maskColor="rgba(0, 0, 0, 0.5)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  );
}

export default function WorkflowEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const workflowId = params.id as string;

  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    updateNodeData,
    clearWorkflow,
    undo,
    redo,
    historyIndex,
    history,
  } = useWorkflowStore();

  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("untitled");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'select' | 'pan'>('select');

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow();
    }
  }, [workflowId]);

  useEffect(() => {
    // Auto-save every 5 seconds
    const interval = setInterval(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveWorkflow();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [nodes, edges, workflowId]);

  const fetchWorkflow = async () => {
    try {
      // Clear the workflow store first to ensure we start with a clean state
      clearWorkflow();
      
      const response = await fetch(`/api/workflows/${workflowId}`);
      const data = await response.json();

      if (response.ok && data.workflow) {
        setWorkflow(data.workflow);
        setWorkflowName(data.workflow.name || "untitled");
        // Load nodes and edges from database (only if they exist)
        // Set both at once to avoid multiple history saves
        const loadedNodes = (data.workflow.nodes && Array.isArray(data.workflow.nodes) && data.workflow.nodes.length > 0) 
          ? data.workflow.nodes 
          : [];
        const loadedEdges = (data.workflow.edges && Array.isArray(data.workflow.edges) && data.workflow.edges.length > 0) 
          ? data.workflow.edges 
          : [];
        
        // Set nodes and edges together, then initialize history
        setNodes(loadedNodes);
        setEdges(loadedEdges);
        
        // Initialize history with the loaded state
        // Use a small delay to ensure state is set
        setTimeout(() => {
          const { history, saveToHistory } = useWorkflowStore.getState();
          if (history.length === 0 || (history.length === 1 && history[0].nodes.length === 0 && history[0].edges.length === 0)) {
            saveToHistory();
          }
        }, 50);
      } else {
        console.error("Failed to fetch workflow:", data.error || "Unknown error");
        router.push("/start-now");
      }
    } catch (error) {
      console.error("Error fetching workflow:", error);
      router.push("/start-now");
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async () => {
    if (!workflowId || isSaving) return;

    setIsSaving(true);
    try {
      await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes,
          edges,
          viewport: { x: 0, y: 0, zoom: 1 },
        }),
      });
    } catch (error) {
      console.error("Error saving workflow:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNameUpdate = async (newName: string) => {
    if (!newName.trim()) {
      setWorkflowName(workflow?.name || "untitled");
      setIsEditingName(false);
      return;
    }

    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflow(data.workflow);
        setWorkflowName(data.workflow.name);
      }
    } catch (error) {
      console.error("Error updating workflow name:", error);
    } finally {
      setIsEditingName(false);
    }
  };

  // Helper function to get connected inputs for an LLM node
  // Takes currentNodes parameter to ensure we're reading fresh data
  const getConnectedInputsForNode = (nodeId: string, currentNodes: Node[]) => {
    const incomingEdges = edges.filter((edge) => edge.target === nodeId);
    let systemPrompt: string | undefined;
    let userMessage: string | undefined;
    const images: string[] = [];

    const isImageOutput = (output: string) => output.startsWith("data:image/") || output.match(/^data:image\//);

    incomingEdges.forEach((edge) => {
      // Use currentNodes instead of nodes to get fresh data
      const sourceNode = currentNodes.find((n) => n.id === edge.source);
      if (!sourceNode) return;
      const handleId = edge.targetHandle;

      if (handleId === "system_prompt") {
        if (sourceNode.type === "text" && sourceNode.data.value) {
          systemPrompt = sourceNode.data.value;
        } else if (sourceNode.type === "llm" && sourceNode.data.output && !isImageOutput(sourceNode.data.output)) {
          systemPrompt = sourceNode.data.output;
        }
      } else if (handleId === "user_message") {
        if (sourceNode.type === "text" && sourceNode.data.value) {
          userMessage = sourceNode.data.value;
        } else if (sourceNode.type === "llm" && sourceNode.data.output && !isImageOutput(sourceNode.data.output)) {
          userMessage = sourceNode.data.output;
        }
      } else if (handleId?.startsWith("images_")) {
        if (sourceNode.type === "image" && sourceNode.data.imageUrl) {
          images.push(sourceNode.data.imageUrl);
        } else if (sourceNode.type === "llm" && sourceNode.data.output && isImageOutput(sourceNode.data.output)) {
          images.push(sourceNode.data.output);
        }
      }
    });

    return { systemPrompt, userMessage, images };
  };

  // Topological sort to determine execution order based on dependencies
  const getExecutionOrder = (llmNodes: Node[]) => {
    // Build dependency map: nodeId -> [dependencies (other LLM node IDs)]
    const dependencies = new Map<string, string[]>();
    const nodeMap = new Map<string, Node>();
    
    llmNodes.forEach((node) => {
      nodeMap.set(node.id, node);
      const deps: string[] = [];
      
      // Find all LLM nodes that this node depends on
      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      incomingEdges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        // If source is an LLM node, this node depends on it
        if (sourceNode && sourceNode.type === "llm") {
          deps.push(sourceNode.id);
        }
      });
      
      dependencies.set(node.id, deps);
    });

    // Topological sort using Kahn's algorithm
    const inDegree = new Map<string, number>();
    llmNodes.forEach((node) => {
      inDegree.set(node.id, dependencies.get(node.id)?.length || 0);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const executionOrder: string[][] = []; // Array of batches (levels)
    
    while (queue.length > 0) {
      const currentBatch: string[] = [];
      const batchSize = queue.length;
      
      // Process all nodes at current level (no dependencies on each other)
      for (let i = 0; i < batchSize; i++) {
        const nodeId = queue.shift()!;
        currentBatch.push(nodeId);
        
        // Find nodes that depend on this node
        llmNodes.forEach((node) => {
          const deps = dependencies.get(node.id) || [];
          if (deps.includes(nodeId)) {
            const newDegree = (inDegree.get(node.id) || 0) - 1;
            inDegree.set(node.id, newDegree);
            if (newDegree === 0) {
              queue.push(node.id);
            }
          }
        });
      }
      
      if (currentBatch.length > 0) {
        executionOrder.push(currentBatch);
      }
    }

    // Check for circular dependencies
    const processedCount = executionOrder.flat().length;
    if (processedCount < llmNodes.length) {
      console.warn("Circular dependency detected in workflow");
      // Add remaining nodes (they have circular dependencies)
      const remaining = llmNodes
        .filter((node) => !executionOrder.flat().includes(node.id))
        .map((node) => node.id);
      if (remaining.length > 0) {
        executionOrder.push(remaining);
      }
    }

    return executionOrder;
  };

  // Run all LLM nodes in dependency order (topological sort)
  const handleRunAll = async () => {
    const llmNodes = nodes.filter((node) => node.type === "llm");
    if (llmNodes.length === 0) {
      alert("No LLM nodes found in the workflow.");
      return;
    }

    setIsRunningAll(true);

    // Get execution order (batches of nodes that can run in parallel)
    const executionOrder = getExecutionOrder(llmNodes);
    
    console.log("Execution order:", executionOrder);

    // Update all nodes to loading state
    llmNodes.forEach((node) => {
      updateNodeData(node.id, { isLoading: true, error: undefined });
    });

    // Run nodes in batches (each batch runs in parallel, but we wait for one batch before starting the next)
    for (const batch of executionOrder) {
      const batchPromises = batch.map(async (nodeId) => {
        const node = llmNodes.find((n) => n.id === nodeId);
        if (!node) return;

        try {
          // Get fresh node data from the store right before execution
          // This ensures we're reading the latest outputs from previous batches
          const currentNodes = useWorkflowStore.getState().nodes;
          const inputs = getConnectedInputsForNode(nodeId, currentNodes);
          
          // Check if user_message is required and present
          if (!inputs.userMessage || inputs.userMessage.trim() === "") {
            throw new Error(`Prompt* is required. Please connect a Text node to the Prompt* input.`);
          }

          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: node.data.model || "gemini-1.5-flash",
              systemPrompt: inputs.systemPrompt,
              userMessage: inputs.userMessage,
              images: inputs.images.length > 0 ? inputs.images : undefined,
            }),
          });

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Failed");

          updateNodeData(nodeId, { 
            output: result.text, 
            isLoading: false, 
            error: undefined 
          });
        } catch (error: any) {
          updateNodeData(nodeId, { 
            isLoading: false, 
            error: error.message 
          });
        }
      });

      // Wait for current batch to complete before starting next batch
      await Promise.all(batchPromises);
      
      // Small delay to ensure state updates are propagated
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsRunningAll(false);
  };

  // Export workflow as JSON
  const handleExportJSON = () => {
    const exportData = {
      name: workflowName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
        width: node.data.width,
        height: node.data.height,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${workflowName || "workflow"}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileSidebarOpen && window.innerWidth < 1024) {
        const target = event.target as HTMLElement;
        if (!target.closest('aside')) {
          setIsMobileSidebarOpen(false);
        }
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileSidebarOpen]);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#1a1a1a] text-white items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-[#f7f7ad] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-[#1a1a1a] text-white relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } border-r border-gray-800 flex flex-col transition-all duration-300 relative
          ${
            isMobileSidebarOpen
              ? "fixed left-0 top-0 h-full z-50 lg:relative lg:z-auto"
              : "hidden lg:flex"
          }`}
        >
          {/* Collapse Button - Positioned on the right edge */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Logo Section */}
          <div className="p-4 border-b border-gray-800">
            {!isSidebarCollapsed ? (
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">W</div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="text-2xl font-bold">W</div>
              </div>
            )}
          </div>

          {/* Quick Access - Node Buttons */}
          {!isSidebarCollapsed && (
            <div className="p-3 sm:p-4 border-b border-gray-800">
              <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase">
                Quick Access
              </h3>
              <div className="space-y-2">
                <button
                  draggable
                  onDragStart={(e) => onDragStart(e, "text")}
                  className="w-full flex items-center space-x-2 px-2 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <FileText className="w-4 h-4 text-[#f7f7ad] flex-shrink-0" />
                  <span className="text-white truncate">Text Node</span>
                </button>
                <button
                  draggable
                  onDragStart={(e) => onDragStart(e, "image")}
                  className="w-full flex items-center space-x-2 px-2 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <ImageIcon className="w-4 h-4 text-[#f7f7ad] flex-shrink-0" />
                  <span className="text-white truncate">Image Node</span>
                </button>
                <button
                  draggable
                  onDragStart={(e) => onDragStart(e, "llm")}
                  className="w-full flex items-center space-x-2 px-2 sm:px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Bot className="w-4 h-4 text-[#f7f7ad] flex-shrink-0" />
                  <span className="text-white truncate">Run Any LLM Node</span>
                </button>
              </div>
            </div>
          )}

          {/* Collapsed Icons */}
          {isSidebarCollapsed && (
            <div className="flex-1 px-2 py-4 space-y-2">
              <button
                draggable
                onDragStart={(e) => onDragStart(e, "text")}
                className="w-full p-3 rounded-lg bg-[#f7f7ad] text-black hover:bg-[#f5f595] transition-colors flex items-center justify-center"
                title="Text Node"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                draggable
                onDragStart={(e) => onDragStart(e, "image")}
                className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
                title="Image Node"
              >
                <ImageIcon className="w-5 h-5 text-[#f7f7ad]" />
              </button>
              <button
                draggable
                onDragStart={(e) => onDragStart(e, "llm")}
                className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center justify-center"
                title="LLM Node"
              >
                <Bot className="w-5 h-5 text-[#f7f7ad]" />
              </button>
            </div>
          )}

          {/* Collapse Toggle - Bottom Button */}
          <div className="p-2 border-t border-gray-800">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 border-b border-gray-800 flex items-center justify-between px-3 sm:px-6 bg-[#1a1a1a]">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                title="Toggle sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {isEditingName ? (
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  onBlur={() => handleNameUpdate(workflowName)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleNameUpdate(workflowName);
                    } else if (e.key === "Escape") {
                      setWorkflowName(workflow?.name || "untitled");
                      setIsEditingName(false);
                    }
                  }}
                  className="bg-transparent border border-gray-700 rounded px-2 py-1 text-white focus:outline-none focus:border-[#f7f7ad] text-sm sm:text-base w-full max-w-[200px] sm:max-w-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-white hover:bg-gray-800 px-2 py-1 rounded text-sm sm:text-base truncate"
                >
                  {workflowName}
                  {isSaving && (
                    <span className="ml-2 text-xs text-gray-400 hidden sm:inline">(saving...)</span>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3">
              <button
                onClick={handleRunAll}
                disabled={isRunningAll}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg bg-[#f7f7ad] text-black hover:bg-[#f5f595] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Run all LLM nodes"
              >
                <Play className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">
                  {isRunningAll ? "Running..." : "Run All"}
                </span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Export workflow as JSON"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Export</span>
              </button>
            </div>
          </header>

          {/* Canvas Area */}
          <div className="flex-1 bg-[#2a2a2a] relative overflow-hidden">
            <WorkflowCanvas 
              interactionMode={interactionMode}
              onNodeAdded={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileSidebarOpen(false);
                }
              }}
            />
          </div>

          {/* Bottom Control Bar */}
          <div className="h-12 border-t border-gray-800 bg-[#1a1a1a] flex items-center justify-start sm:justify-center space-x-2 sm:space-x-4 px-2 sm:px-4 overflow-x-auto">
            <button
              onClick={() => setInteractionMode('select')}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                interactionMode === 'select'
                  ? 'bg-[#f7f7ad] text-black hover:bg-[#f5f595]'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title="Select (Move nodes only)"
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setInteractionMode('pan')}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                interactionMode === 'pan'
                  ? 'bg-[#f7f7ad] text-black hover:bg-[#f5f595]'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
              title="Pan (Move canvas and nodes)"
            >
              <Hand className="w-4 h-4" />
            </button>
            <button
              onClick={undo}
              disabled={historyIndex === 0}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 flex-shrink-0"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </ReactFlowProvider>
  );
}

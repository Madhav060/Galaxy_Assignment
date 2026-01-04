"use client";

import { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Play,
  Loader2,
  AlertCircle,
  Download,
  Check,
  Copy,
  Plus,
  X,
} from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";
import ReactMarkdown from "react-markdown";

interface LLMNodeData {
  model: string;
  systemPrompt?: string;
  userMessage?: string;
  images?: string[];
  imageInputCount?: number;
  output?: string;
  isLoading?: boolean;
  error?: string;
  id: string;
  width?: number;
  height?: number;
}

const LLMNode = ({ id, data, selected }: NodeProps<LLMNodeData>) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const updateNodeSize = useWorkflowStore((state) => state.updateNodeSize);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  
  const [isRunning, setIsRunning] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  // Defaults
  const nodeWidth = data.width || 360;
  const nodeHeight = data.height || 450;
  const imageInputCount = data.imageInputCount || 1;

  // --- Utility Functions ---
  const isImageOutput = (output: string) => output.startsWith("data:image/") || output.match(/^data:image\//);

  // --- Logic Helpers ---

  const getConnectedInputs = () => {
    const incomingEdges = edges.filter((edge) => edge.target === id);
    let systemPrompt: string | undefined;
    let userMessage: string | undefined;
    const images: string[] = [];

    incomingEdges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode) return;
      const handleId = edge.targetHandle;

      // System Prompt: accepts text from Text nodes or output from LLM nodes
      if (handleId === "system_prompt") {
        if (sourceNode.type === "text" && sourceNode.data.value) {
          systemPrompt = sourceNode.data.value;
        } else if (sourceNode.type === "llm" && sourceNode.data.output && !isImageOutput(sourceNode.data.output)) {
          systemPrompt = sourceNode.data.output;
        }
      }
      // User Message (Prompt*): accepts text from Text nodes or output from LLM nodes
      else if (handleId === "user_message") {
        if (sourceNode.type === "text" && sourceNode.data.value) {
          userMessage = sourceNode.data.value;
        } else if (sourceNode.type === "llm" && sourceNode.data.output && !isImageOutput(sourceNode.data.output)) {
          userMessage = sourceNode.data.output;
        }
      }
      // Images: accepts from Image nodes or image output from LLM nodes
      else if (handleId?.startsWith("images_")) {
        if (sourceNode.type === "image" && sourceNode.data.imageUrl) {
          images.push(sourceNode.data.imageUrl);
        } else if (sourceNode.type === "llm" && sourceNode.data.output && isImageOutput(sourceNode.data.output)) {
          images.push(sourceNode.data.output);
        }
      }
    });
    return { systemPrompt, userMessage, images };
  };

  const handleRun = async () => {
    setIsRunning(true);
    updateNodeData(id, { isLoading: true, error: undefined });
    try {
      const inputs = getConnectedInputs();
      
      // Prompt* (user_message) is required - cannot be empty
      if (!inputs.userMessage || inputs.userMessage.trim() === "") {
        throw new Error("Prompt* is required. Please connect a Text node to the Prompt* input.");
      }
      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: data.model || "gemini-1.5-flash",
          systemPrompt: inputs.systemPrompt, // Optional - can be empty
          userMessage: inputs.userMessage, // Required
          images: inputs.images.length > 0 ? inputs.images : undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed");
      updateNodeData(id, { output: result.text, isLoading: false, error: undefined });
    } catch (error: any) {
      updateNodeData(id, { isLoading: false, error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  // --- Resizing Logic ---
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartSize({ width: nodeWidth, height: nodeHeight, x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = e.clientX - startSize.x;
      const deltaY = e.clientY - startSize.y;
      updateNodeSize(id, Math.max(300, startSize.width + deltaX), Math.max(350, startSize.height + deltaY));
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startSize, id, updateNodeSize]);

  // --- Utility Functions ---
  const addImageInput = () => updateNodeData(id, { imageInputCount: (data.imageInputCount || 1) + 1 });
  
  const handleCopy = async () => {
    if (!data.output) return;
    await navigator.clipboard.writeText(data.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
     if (!data.output || !isImageOutput(data.output)) return;
     const link = document.createElement("a");
     link.href = data.output;
     link.download = `output-${Date.now()}.png`;
     link.click();
  };

  // Calculate handle positions (from top of node, in percentage)
  const getHandleTop = (index: number) => {
    const startOffset = 80; // Start below header
    const spacing = 50; // Space between handles
    return `${startOffset + (index * spacing)}px`;
  };

  return (
    <div
      ref={nodeRef}
      className={`bg-[#1e1e1e] rounded-2xl shadow-2xl relative flex flex-col transition-all duration-200 
        ${selected ? "ring-2 ring-pink-500/50" : "border border-gray-800"}`}
      style={{ width: nodeWidth, height: nodeHeight }}
    >
      {/* --- Header (Simplified) --- */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <h3 className="text-gray-200 font-medium text-sm">
          {data.model || "Any LLM"}
        </h3>
        
        {/* Only show delete X if selected, otherwise clean */}
        {selected && (
           <button onClick={() => deleteNode(id)} className="p-1 hover:text-red-400 text-gray-500 transition-colors">
              <X size={14}/>
           </button>
        )}
      </div>

      {/* --- Body --- */}
      <div className="flex-1 px-4 py-2 flex flex-col min-h-0 relative">
        
        {/* Input Handles - Positioned on the left border */}
        {/* 1. Prompt (required) */}
        <div className="absolute left-0 flex items-center group" style={{ top: getHandleTop(0) }}>
          <span className="absolute right-3 text-xs font-medium text-pink-400 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#1e1e1e] px-1">
            Prompt*
          </span>
          <Handle
            type="target"
            position={Position.Left}
            id="user_message"
            className="!w-3 !h-3 !bg-pink-500 !border-2 !border-gray-800 !rounded-full"
          />
        </div>

        {/* 2. System Prompt */}
        <div className="absolute left-0 flex items-center group" style={{ top: getHandleTop(1) }}>
          <span className="absolute right-3 text-xs font-medium text-pink-400 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#1e1e1e] px-1">
            System Prompt
          </span>
          <Handle
            type="target"
            position={Position.Left}
            id="system_prompt"
            className="!w-3 !h-3 !bg-pink-500 !border-2 !border-gray-800 !rounded-full"
          />
        </div>

        {/* 3. Image Inputs (Dynamic) */}
        {Array.from({ length: imageInputCount }).map((_, index) => {
          const handleId = `images_${index}`;
          const topPosition = getHandleTop(2 + index);
          return (
            <div 
              key={`image-handle-${id}-${index}-${imageInputCount}`} 
              className="absolute left-0 flex items-center group" 
              style={{ top: topPosition, zIndex: 10 }}
            >
              <span className="absolute right-3 text-xs font-medium text-teal-400 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#1e1e1e] px-1">
                Image {index + 1}
              </span>
              <Handle
                type="target"
                position={Position.Left}
                id={handleId}
                className="!w-3 !h-3 !bg-teal-500 !border-2 !border-gray-800 !rounded-full"
                style={{ left: 0 }}
              />
            </div>
          );
        })}

        {/* Output Handle (Right Side) */}
        <div className="absolute right-0 flex items-center group" style={{ top: getHandleTop(0), zIndex: 10 }}>
          <span className="absolute left-3 text-xs font-medium text-pink-400 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#1e1e1e] px-1">
            Output
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="output"
            className="!w-3 !h-3 !bg-pink-500 !border-2 !border-gray-800 !rounded-full"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#2b2b2b] rounded-xl p-4 overflow-hidden flex flex-col relative group">
            {data.error ? (
                <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-2">
                    <AlertCircle className="w-6 h-6" />
                    <span className="text-xs text-center px-4">{data.error}</span>
                </div>
            ) : data.output ? (
                <>
                    {/* Toolbar */}
                    <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1e1e1e] rounded-md p-1 shadow-lg z-20">
                        {isImageOutput(data.output) ? (
                            <button onClick={handleDownload} className="p-1 hover:text-white text-gray-400"><Download size={14} /></button>
                        ) : (
                            <button onClick={handleCopy} className="p-1 hover:text-white text-gray-400">
                                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                        )}
                    </div>

                    <div className="w-full h-full overflow-y-auto pr-2 custom-scrollbar">
                        {isImageOutput(data.output) ? (
                             <img src={data.output} alt="Output" className="w-full h-auto rounded-lg" />
                        ) : (
                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 text-sm leading-relaxed font-light">
                                <ReactMarkdown>{data.output}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="h-full w-full flex items-start pt-1">
                    <span className="text-gray-500 text-sm font-light">The generated text will appear here</span>
                </div>
            )}
            
            {/* Loading Overlay */}
            {(isRunning || data.isLoading) && (
                <div className="absolute inset-0 bg-[#2b2b2b]/80 flex items-center justify-center z-30">
                    <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                </div>
            )}
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="px-5 pb-5 pt-3 flex items-center justify-between shrink-0">
        <button 
            onClick={addImageInput}
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-xs font-medium"
        >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Image Input</span>
        </button>

        <button
            onClick={handleRun}
            disabled={isRunning || data.isLoading}
            className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold text-[#1e1e1e] transition-all
                ${isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-white hover:bg-gray-200 shadow-md'}
            `}
        >
            {isRunning ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing</span>
                </>
            ) : (
                <>
                    <span>Run Model</span>
                    <Play className="w-3 h-3 fill-current" />
                </>
            )}
        </button>
      </div>

      {/* Resize Handle */}
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-20 rounded-br-2xl hover:bg-white/10"
          onMouseDown={handleResizeStart}
        >
            <svg viewBox="0 0 10 10" className="w-full h-full text-gray-600 p-1">
                <path d="M 10 0 L 10 10 L 0 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
        </div>
      )}
    </div>
  );
};

export default memo(LLMNode);
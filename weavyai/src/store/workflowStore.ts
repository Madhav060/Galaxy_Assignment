import { create } from "zustand";
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from "reactflow";
import { nanoid } from "nanoid";

export interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: string, position: { x: number; y: number }, data?: any) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  deleteSelected: () => void;
  clearWorkflow: () => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeSize: (nodeId: string, width: number, height: number) => void;
  // Undo/Redo
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  history: [{ nodes: initialNodes, edges: initialEdges }],
  historyIndex: 0,

  onNodesChange: (changes) => {
    const newNodes = applyNodeChanges(changes, get().nodes);
    set({ nodes: newNodes });
    
    // Save to history if nodes were moved or selected (but not on every change to avoid too many saves)
    const hasPositionChange = changes.some(
      (change: any) => change.type === 'position' && change.dragging === false
    );
    if (hasPositionChange) {
      get().saveToHistory();
    }
  },

  onEdgesChange: (changes) => {
    const newEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: newEdges });
    
    // Save to history when edges are changed
    if (changes.length > 0) {
      get().saveToHistory();
    }
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
    get().saveToHistory();
  },

  addNode: (type, position, data = {}) => {
    // Set default dimensions based on node type
    let defaultWidth = 300;
    let defaultHeight = 400;
    
    if (type === "text") {
      defaultWidth = 200;
      defaultHeight = 120;
    } else if (type === "image") {
      defaultWidth = 200;
      defaultHeight = 200;
    } else if (type === "llm") {
      defaultWidth = 300;
      defaultHeight = 400;
    }

    const newNode: Node = {
      id: nanoid(),
      type,
      position,
      data: {
        ...data,
        id: nanoid(),
        width: data.width || defaultWidth,
        height: data.height || defaultHeight,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
    get().saveToHistory();
  },

  updateNodeData: (nodeId, newData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      ),
    });
    // Note: We don't save to history here to avoid too many saves during typing/editing
    // History is saved on blur or when explicitly needed
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
    get().saveToHistory();
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
    get().saveToHistory();
  },

  deleteSelected: () => {
    const { nodes, edges } = get();
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    
    const nodeIdsToDelete = selectedNodes.map((node) => node.id);
    const edgeIdsToDelete = selectedEdges.map((edge) => edge.id || "");

    set({
      nodes: nodes.filter((node) => !node.selected),
      edges: edges.filter(
        (edge) =>
          !edge.selected &&
          !nodeIdsToDelete.includes(edge.source) &&
          !nodeIdsToDelete.includes(edge.target)
      ),
    });
    get().saveToHistory();
  },

  updateNodeSize: (nodeId, width, height) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              style: { ...node.style, width, height },
              data: { ...node.data, width, height },
            }
          : node
      ),
    });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      history: [{ nodes: [], edges: [] }],
      historyIndex: 0,
    });
  },

  setNodes: (nodes) => {
    set({ nodes });
    // Initialize history when loading nodes (e.g., from database)
    const currentHistory = get().history;
    if (currentHistory.length === 0 || currentHistory.length === 1) {
      get().saveToHistory();
    }
  },

  setEdges: (edges) => {
    set({ edges });
    // Initialize history when loading edges (e.g., from database)
    const currentHistory = get().history;
    if (currentHistory.length === 0 || currentHistory.length === 1) {
      get().saveToHistory();
    }
  },

  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    
    // Deep clone nodes and edges using JSON to ensure complete deep copy
    const clonedNodes = JSON.parse(JSON.stringify(nodes));
    const clonedEdges = JSON.parse(JSON.stringify(edges));
    
    // Remove any future history if we're not at the end (user did something after undo)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: clonedNodes, edges: clonedEdges });
    
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      set({
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: historyIndex + 1,
      });
    }
  },
}));


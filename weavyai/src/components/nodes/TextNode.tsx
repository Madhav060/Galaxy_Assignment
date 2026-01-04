"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "reactflow";
import { FileText, X, Maximize2, Minimize2 } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

interface TextNodeData {
  value: string;
  id: string;
  width?: number;
  height?: number;
}

const TextNode = ({ id, data, selected }: NodeProps<TextNodeData>) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const updateNodeSize = useWorkflowStore((state) => state.updateNodeSize);
  const { updateNode } = useReactFlow();
  const [value, setValue] = useState(data.value || "");
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const nodeWidth = data.width || 200;
  const nodeHeight = data.height || 120;

  useEffect(() => {
    if (nodeRef.current && (data.width || data.height)) {
      nodeRef.current.style.width = `${nodeWidth}px`;
      nodeRef.current.style.height = `${nodeHeight}px`;
    }
  }, [data.width, data.height, nodeWidth, nodeHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    updateNodeData(id, { value: newValue });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setStartSize({
      width: nodeWidth,
      height: nodeHeight,
      x: e.clientX,
      y: e.clientY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startSize.x;
      const deltaY = e.clientY - startSize.y;

      const newWidth = Math.max(200, startSize.width + deltaX);
      const newHeight = Math.max(120, startSize.height + deltaY);

      updateNodeSize(id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startSize, id, updateNodeSize]);

  const increaseSize = () => {
    updateNodeSize(id, nodeWidth + 50, nodeHeight + 30);
  };

  const decreaseSize = () => {
    updateNodeSize(id, Math.max(200, nodeWidth - 50), Math.max(120, nodeHeight - 30));
  };

  return (
    <div
      ref={nodeRef}
      className={`bg-gray-800 border ${
        selected ? "border-[#f7f7ad]" : "border-gray-700"
      } rounded-lg shadow-lg min-w-[200px] relative`}
      style={{ width: nodeWidth, height: nodeHeight }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700 bg-gray-750">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#f7f7ad]" />
          <span className="text-sm font-medium text-white">Text</span>
        </div>
        {selected && (
          <div className="flex items-center space-x-1">
            <button
              onClick={decreaseSize}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Decrease size"
            >
              <Minimize2 className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={increaseSize}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Increase size"
            >
              <Maximize2 className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={() => deleteNode(id)}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
              title="Delete node"
            >
              <X className="w-3 h-3 text-gray-400 hover:text-red-400" />
            </button>
          </div>
        )}
      </div>
      <div className="p-3 h-[calc(100%-40px)]">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Enter text..."
          className="w-full h-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#f7f7ad]"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-[#f7f7ad] border-2 border-gray-800"
      />
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-[#f7f7ad] cursor-nwse-resize"
          onMouseDown={handleResizeStart}
          style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
        />
      )}
    </div>
  );
};

export default memo(TextNode);


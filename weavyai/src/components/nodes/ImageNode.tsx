"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Image as ImageIcon, X, Maximize2, Minimize2 } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

interface ImageNodeData {
  imageUrl?: string;
  imageFile?: File;
  id: string;
  width?: number;
  height?: number;
}

const ImageNode = ({ id, data, selected }: NodeProps<ImageNodeData>) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const deleteNode = useWorkflowStore((state) => state.deleteNode);
  const updateNodeSize = useWorkflowStore((state) => state.updateNodeSize);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState(data.imageUrl || "");
  const [isResizing, setIsResizing] = useState(false);
  const [startSize, setStartSize] = useState({ width: 0, height: 0, x: 0, y: 0 });

  const nodeWidth = data.width || 200;
  const nodeHeight = data.height || 200;

  useEffect(() => {
    if (nodeRef.current && (data.width || data.height)) {
      nodeRef.current.style.width = `${nodeWidth}px`;
      nodeRef.current.style.height = `${nodeHeight}px`;
    }
  }, [data.width, data.height, nodeWidth, nodeHeight]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setImageUrl(url);
        updateNodeData(id, { imageUrl: url, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setImageUrl("");
    updateNodeData(id, { imageUrl: "", imageFile: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      const newHeight = Math.max(200, startSize.height + deltaY);

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
    updateNodeSize(id, nodeWidth + 50, nodeHeight + 50);
  };

  const decreaseSize = () => {
    updateNodeSize(id, Math.max(200, nodeWidth - 50), Math.max(200, nodeHeight - 50));
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
          <ImageIcon className="w-4 h-4 text-[#f7f7ad]" />
          <span className="text-sm font-medium text-white">Image</span>
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
        {imageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover rounded border border-gray-600"
            />
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full border-2 border-dashed border-gray-600 rounded flex items-center justify-center cursor-pointer hover:border-[#f7f7ad] transition-colors"
          >
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Click to upload</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
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

export default memo(ImageNode);


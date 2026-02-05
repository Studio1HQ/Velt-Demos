"use client";

import { VeltCommentTool } from "@veltdev/react";
import { MousePointer2, Pen, Image, Type, Settings } from "lucide-react";
import { usePDFEditor } from "../context/PDFEditorContext";

interface LeftToolbarProps {
  onAddImage: () => void;
}

const tools = [
  {
    id: "pointer",
    icon: MousePointer2,
    label: "Select",
  },
  { id: "comment", icon: null, label: "Comment", isVelt: true },
  {
    id: "draw",
    icon: Pen,
    label: "Draw",
  },
  {
    id: "image",
    icon: Image,
    label: "Add Image",
  },
  { id: "text", icon: Type, label: "Text" },
];

export function LeftToolbar({ onAddImage }: LeftToolbarProps) {
  const { activeTool, setActiveTool } = usePDFEditor();
  return (
    <div className="w-14 bg-white dark:bg-[#2c2c2c] border-r border-gray-200 dark:border-[#404040] flex flex-col items-center py-4 gap-2 relative transition-colors duration-200">
      {tools.map((tool) => (
        <div key={tool.id} className="relative group">
          {tool.isVelt ? (
            <div className="w-8 h-8 flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors cursor-pointer">
              <VeltCommentTool />
            </div>
          ) : (
            <button
              onClick={() => {
                setActiveTool(tool.id);
                if (tool.id === "image") {
                  onAddImage();
                }
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                activeTool === tool.id
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040]"
              }`}
            >
              {tool.icon && <tool.icon className="w-5 h-5" />}
            </button>
          )}

          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {tool.label}
          </div>
        </div>
      ))}

      <div className="flex-1" />

      {/* Divider */}
      <div className="w-8 h-px bg-gray-200 dark:bg-[#404040] my-2" />

      {/* Additional tools */}
      <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#404040] transition-colors group relative">
        <Settings className="w-5 h-5" />
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          Settings
        </div>
      </button>
    </div>
  );
}

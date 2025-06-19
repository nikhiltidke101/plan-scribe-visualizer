
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MousePointer2,
  Minus,
  Square,
  Circle,
  PenTool,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Eraser,
} from "lucide-react";
import { Tool } from "./Canvas";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onClear: () => void;
  onDelete: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  showAnnotations: boolean;
  onToggleAnnotations: (show: boolean) => void;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  onClear,
  onDelete,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  showAnnotations,
  onToggleAnnotations,
}: ToolbarProps) => {
  const tools = [
    { id: "select" as Tool, icon: MousePointer2, label: "Select" },
    { id: "line" as Tool, icon: Minus, label: "Line" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "draw" as Tool, icon: PenTool, label: "Freehand" },
  ];

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="space-y-4">
        {/* Drawing Tools */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Drawing Tools</h3>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "outline"}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className="flex flex-col items-center gap-1 h-16"
                title={tool.label}
              >
                <tool.icon className="h-4 w-4" />
                <span className="text-xs">{tool.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* View Controls */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">View</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleAnnotations(!showAnnotations)}
              className="flex items-center gap-2"
            >
              {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span className="text-xs">
                {showAnnotations ? "Hide" : "Show"} Annotations
              </span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Zoom Controls */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Zoom</h3>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={onZoomIn} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onZoomOut} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onResetZoom} title="Reset Zoom">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="w-full flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="w-full flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <Eraser className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

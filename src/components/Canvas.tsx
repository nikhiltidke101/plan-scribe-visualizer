import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, Line, Path } from "fabric";
import { Toolbar } from "./Toolbar";
import { AnnotationPanel } from "./AnnotationPanel";
import { toast } from "sonner";

export type Tool = "select" | "line" | "rectangle" | "circle" | "draw";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - 320, // Account for sidebar
      height: window.innerHeight - 80, // Account for header
      backgroundColor: "#ffffff",
    });

    // Add grid background
    const grid = 20;
    const gridOptions = {
      stroke: "#e5e7eb",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    };

    for (let i = 0; i < canvas.width! / grid; i++) {
      const line = new Line([i * grid, 0, i * grid, canvas.height!], gridOptions);
      canvas.add(line);
    }

    for (let i = 0; i < canvas.height! / grid; i++) {
      const line = new Line([0, i * grid, canvas.width!, i * grid], gridOptions);
      canvas.add(line);
    }

    // Initialize freeDrawingBrush properly
    canvas.isDrawingMode = false;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = "#1f2937";
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);
    toast.success("Canvas ready! Start designing your building plan.");

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    // Ensure freeDrawingBrush exists before setting properties
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = "#1f2937";
      fabricCanvas.freeDrawingBrush.width = 2;
    }
    
    const handleMouseDown = (e: any) => {
      // Only create new shapes if we're not in select mode or if no object is targeted
      if (activeTool === "line" || activeTool === "rectangle" || activeTool === "circle") {
        // Check if we clicked on an existing object
        const target = fabricCanvas.findTarget(e.e, false);
        if (target && target.selectable !== false) {
          // If we clicked on an existing selectable object, don't create a new shape
          return;
        }

        const pointer = fabricCanvas.getPointer(e.e);
        setStartPoint({ x: pointer.x, y: pointer.y });
        setIsDrawing(true);
      }
    };

    const handleMouseUp = (e: any) => {
      if (!isDrawing || !startPoint) return;

      const pointer = fabricCanvas.getPointer(e.e);
      
      // Check if we moved enough to create a shape (avoid accidental tiny shapes)
      const minDistance = 5;
      const distance = Math.sqrt(
        Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
      );
      
      if (distance < minDistance) {
        setIsDrawing(false);
        setStartPoint(null);
        return;
      }
      
      if (activeTool === "line") {
        const line = new Line([startPoint.x, startPoint.y, pointer.x, pointer.y], {
          stroke: "#1f2937",
          strokeWidth: 2,
          selectable: true,
        });
        fabricCanvas.add(line);
      } else if (activeTool === "rectangle") {
        const rect = new Rect({
          left: Math.min(startPoint.x, pointer.x),
          top: Math.min(startPoint.y, pointer.y),
          width: Math.abs(pointer.x - startPoint.x),
          height: Math.abs(pointer.y - startPoint.y),
          fill: "transparent",
          stroke: "#1f2937",
          strokeWidth: 2,
          selectable: true,
        });
        fabricCanvas.add(rect);
      } else if (activeTool === "circle") {
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) + Math.pow(pointer.y - startPoint.y, 2)
        ) / 2;
        const circle = new Circle({
          left: startPoint.x,
          top: startPoint.y,
          radius: radius,
          fill: "transparent",
          stroke: "#1f2937",
          strokeWidth: 2,
          selectable: true,
        });
        fabricCanvas.add(circle);
      }

      setIsDrawing(false);
      setStartPoint(null);
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, fabricCanvas, isDrawing, startPoint]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    
    // Keep grid lines, remove only user-created objects
    const objects = fabricCanvas.getObjects();
    const userObjects = objects.filter(obj => obj.selectable !== false);
    userObjects.forEach(obj => fabricCanvas.remove(obj));
    
    fabricCanvas.renderAll();
    toast.success("Drawing cleared!");
  };

  const handleDeleteSelected = () => {
    if (!fabricCanvas) return;
    
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach(obj => fabricCanvas.remove(obj));
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      toast.success("Selected objects deleted!");
    }
  };

  const handleZoomIn = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.min(zoom * 1.2, 3));
  };

  const handleZoomOut = () => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(Math.max(zoom * 0.8, 0.3));
  };

  const handleResetZoom = () => {
    if (!fabricCanvas) return;
    fabricCanvas.setZoom(1);
    fabricCanvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    fabricCanvas.renderAll();
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-hidden">
          <canvas ref={canvasRef} className="border border-gray-200" />
        </div>
      </div>
      
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onClear={handleClear}
          onDelete={handleDeleteSelected}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          showAnnotations={showAnnotations}
          onToggleAnnotations={setShowAnnotations}
        />
        
        <AnnotationPanel
          canvas={fabricCanvas}
          showAnnotations={showAnnotations}
        />
      </div>
    </div>
  );
};

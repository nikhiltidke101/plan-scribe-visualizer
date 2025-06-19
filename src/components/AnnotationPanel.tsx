
import { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Square, CircleDot } from "lucide-react";

interface AnnotationPanelProps {
  canvas: FabricCanvas | null;
  showAnnotations: boolean;
}

interface ObjectAnnotation {
  id: string;
  type: string;
  dimensions: string;
  position: string;
}

export const AnnotationPanel = ({ canvas, showAnnotations }: AnnotationPanelProps) => {
  const [annotations, setAnnotations] = useState<ObjectAnnotation[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const updateAnnotations = () => {
      const objects = canvas.getObjects().filter(obj => obj.selectable !== false);
      const newAnnotations: ObjectAnnotation[] = [];

      objects.forEach((obj, index) => {
        let dimensions = "";
        let type = "";
        let icon = Square;

        if (obj.type === "rect") {
          const width = Math.round((obj.width || 0) * (obj.scaleX || 1));
          const height = Math.round((obj.height || 0) * (obj.scaleY || 1));
          dimensions = `${width} × ${height} px`;
          type = "Rectangle";
          icon = Square;
        } else if (obj.type === "circle") {
          const radius = Math.round((obj.radius || 0) * (obj.scaleX || 1));
          dimensions = `R: ${radius} px`;
          type = "Circle";
          icon = CircleDot;
        } else if (obj.type === "line") {
          const x1 = obj.x1 || 0;
          const y1 = obj.y1 || 0;
          const x2 = obj.x2 || 0;
          const y2 = obj.y2 || 0;
          const length = Math.round(Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
          dimensions = `${length} px`;
          type = "Line";
          icon = Ruler;
        } else if (obj.type === "path") {
          type = "Freehand";
          dimensions = "Custom shape";
        }

        if (type) {
          newAnnotations.push({
            id: `obj-${index}`,
            type,
            dimensions,
            position: `${Math.round(obj.left || 0)}, ${Math.round(obj.top || 0)}`,
          });
        }
      });

      setAnnotations(newAnnotations);
    };

    const handleObjectModified = () => updateAnnotations();
    const handleObjectAdded = () => updateAnnotations();
    const handleObjectRemoved = () => updateAnnotations();

    canvas.on("object:modified", handleObjectModified);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:removed", handleObjectRemoved);

    updateAnnotations();

    return () => {
      canvas.off("object:modified", handleObjectModified);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:removed", handleObjectRemoved);
    };
  }, [canvas]);

  if (!showAnnotations) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm">Annotations hidden</p>
          <p className="text-xs text-gray-400 mt-1">Toggle visibility in toolbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            Annotations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {annotations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No objects to annotate</p>
              <p className="text-xs text-gray-400 mt-1">
                Start drawing to see dimensions
              </p>
            </div>
          ) : (
            annotations.map((annotation) => (
              <div
                key={annotation.id}
                className="p-3 border border-gray-200 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {annotation.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{annotation.dimensions}</p>
                  <p className="text-xs text-gray-500">
                    Position: {annotation.position}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

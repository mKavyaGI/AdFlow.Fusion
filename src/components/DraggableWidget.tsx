import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion } from "motion/react";
import { GripVertical } from "lucide-react";

export interface Widget {
  id: string;
  type: "metric" | "chart" | "table";
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: React.ReactNode;
}

interface DraggableWidgetProps {
  widget: Widget;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

const ItemType = "WIDGET";

export function DraggableWidget({ widget, onMove, children }: DraggableWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemType,
    item: { id: widget.id, position: widget.position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { id: string; position: { x: number; y: number } }, monitor) => {
      if (!ref.current) return;
      
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newPosition = {
        x: item.position.x + delta.x,
        y: item.position.y + delta.y,
      };
      
      onMove(item.id, newPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  dragPreview(drop(ref));

  return (
    <motion.div
      ref={ref}
      style={{
        position: "absolute",
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
      }}
      className={`group ${isDragging ? "opacity-50" : ""} ${
        isOver ? "ring-2 ring-primary/50" : ""
      }`}
      animate={{
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Drag handle */}
      <motion.div
        ref={drag}
        className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="bg-primary text-primary-foreground p-1 rounded-md shadow-lg">
          <GripVertical className="h-4 w-4" />
        </div>
      </motion.div>

      {/* Resize handles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {/* Corner resize handles */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize pointer-events-auto" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-ne-resize pointer-events-auto" />
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nw-resize pointer-events-auto" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-sw-resize pointer-events-auto" />
      </div>

      {/* Widget content */}
      <motion.div
        className="w-full h-full"
        animate={{
          boxShadow: isDragging 
            ? "0 10px 25px rgba(0,0,0,0.2)" 
            : "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
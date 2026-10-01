"use client";

import { useId, type ReactNode } from "react";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/bo/cn";

/** Liste réordonnable (souris, tactile et clavier : Espace pour saisir, flèches pour déplacer) */
export function SortableList<T extends { id: string }>({ items, onChange, children }: { items: T[]; onChange: (items: T[]) => void; children: ReactNode }) {
  const id = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    onChange(arrayMove(items, from, to));
  };
  return (
    <DndContext id={id} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export function SortableItem({ id, children, className, handleLabel }: { id: string; children: ReactNode; className?: string; handleLabel: string }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("relative flex items-start gap-1.5", isDragging && "z-10 opacity-80", className)}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={handleLabel}
        className="mt-[11px] shrink-0 cursor-grab touch-none rounded-bo-sm p-0.5 text-bo-icon hover:text-bo-ink active:cursor-grabbing lg:mt-[9px]"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

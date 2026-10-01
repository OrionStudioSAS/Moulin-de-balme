import { Card, SkeletonRows } from "@/components/bo/ui/Display";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="bo-skeleton h-9 w-40" />
        <span className="bo-skeleton h-4 w-56" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex gap-5 border-b border-bo-line px-4 py-3">
          {[60, 48, 80, 44].map((w, i) => (
            <span key={i} className="bo-skeleton h-4" style={{ width: w }} />
          ))}
        </div>
        <SkeletonRows rows={8} />
      </Card>
    </div>
  );
}

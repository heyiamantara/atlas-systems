import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isAnimated = (data as Record<string, unknown>)?.animated;
  const label = (data as Record<string, unknown>)?.label as string | undefined;
  const protocol = (data as Record<string, unknown>)?.protocol as string | undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: 'hsl(var(--muted-foreground))',
          strokeWidth: 1.5,
          opacity: 0.5,
          ...(isAnimated
            ? {
                stroke: 'hsl(var(--primary))',
                strokeDasharray: '6 6',
                opacity: 0.7,
                animation: 'flow 2s linear infinite',
              }
            : {}),
        }}
      />
      {label && (
        <foreignObject
          width={120}
          height={30}
          x={labelX - 60}
          y={labelY - 15}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-[9px] font-mono bg-background/90 border border-border rounded px-1.5 py-0.5 text-muted-foreground whitespace-nowrap">
              {protocol && <span className="text-primary/70">{protocol}</span>}
              {protocol && label && <span className="mx-0.5">·</span>}
              {label}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

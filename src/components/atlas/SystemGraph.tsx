import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { Project, Service } from '@/data/projects';
import ServiceNodeComponent from './ServiceNode';
import AnimatedEdge from './AnimatedEdge';
import ServicePanel from './ServicePanel';
import InfraPanel from './InfraPanel';

const nodeTypes = { service: ServiceNodeComponent };
const edgeTypes = { animated: AnimatedEdge };

interface SystemGraphProps {
  project: Project;
}

function getLayoutPositions(services: Service[]): Record<string, { x: number; y: number }> {
  // Assign positions based on type hierarchy
  const typeOrder: Record<string, number> = {
    gateway: 0,
    auth: 1,
    api: 1,
    ai: 1,
    queue: 2,
    worker: 2,
    db: 3,
    cache: 3,
  };

  const rows: Record<number, Service[]> = {};
  services.forEach((s) => {
    const row = typeOrder[s.type] ?? 2;
    if (!rows[row]) rows[row] = [];
    rows[row].push(s);
  });

  const positions: Record<string, { x: number; y: number }> = {};
  Object.entries(rows).forEach(([rowStr, rowServices]) => {
    const row = parseInt(rowStr);
    const totalWidth = rowServices.length * 240;
    const startX = -totalWidth / 2 + 120;
    rowServices.forEach((s, i) => {
      positions[s.id] = {
        x: startX + i * 240,
        y: row * 180,
      };
    });
  });

  return positions;
}

export default function SystemGraph({ project }: SystemGraphProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const positions = useMemo(() => getLayoutPositions(project.services), [project.services]);

  const initialNodes: Node[] = useMemo(
    () =>
      project.services.map((s) => ({
        id: s.id,
        type: 'service',
        position: positions[s.id] || { x: 0, y: 0 },
        data: { service: s, selected: selectedService?.id === s.id },
      })),
    [project.services, positions, selectedService]
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      project.dependencies.map((d, i) => ({
        id: `e-${d.source}-${d.target}-${i}`,
        source: d.source,
        target: d.target,
        type: 'animated',
        data: { animated: d.animated, label: d.label, protocol: d.protocol },
      })),
    [project.dependencies]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [project.id, initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const svc = project.services.find((s) => s.id === node.id);
      if (svc) setSelectedService(svc);
    },
    [project.services]
  );

  const handleSelectService = useCallback((service: Service) => {
    setSelectedService(service);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden relative">
      <InfraPanel project={project} onSelectService={handleSelectService} />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          minZoom={0.3}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={() => 'hsl(var(--primary))'}
            maskColor="hsl(var(--background) / 0.8)"
            style={{ height: 80, width: 120 }}
          />
        </ReactFlow>

        <ServicePanel service={selectedService} onClose={() => setSelectedService(null)} />
      </div>
    </div>
  );
}

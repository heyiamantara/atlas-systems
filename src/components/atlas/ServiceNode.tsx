import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { Service, ServiceType } from '@/data/projects';
import {
  Globe, Shield, MessageSquare, Brain, Database, 
  Layers, Cpu, Server, HardDrive
} from 'lucide-react';

const typeIcons: Record<ServiceType, React.ElementType> = {
  gateway: Globe,
  auth: Shield,
  api: Server,
  ai: Brain,
  db: Database,
  queue: Layers,
  worker: Cpu,
  cache: HardDrive,
};

const typeColorClasses: Record<ServiceType, string> = {
  gateway: 'border-node-gateway text-node-gateway',
  auth: 'border-node-auth text-node-auth',
  api: 'border-node-api text-node-api',
  ai: 'border-node-ai text-node-ai',
  db: 'border-node-db text-node-db',
  queue: 'border-node-queue text-node-queue',
  worker: 'border-node-worker text-node-worker',
  cache: 'border-node-cache text-node-cache',
};

const typeBgClasses: Record<ServiceType, string> = {
  gateway: 'bg-node-gateway/10',
  auth: 'bg-node-auth/10',
  api: 'bg-node-api/10',
  ai: 'bg-node-ai/10',
  db: 'bg-node-db/10',
  queue: 'bg-node-queue/10',
  worker: 'bg-node-worker/10',
  cache: 'bg-node-cache/10',
};

const statusDotClasses: Record<string, string> = {
  healthy: 'bg-status-healthy',
  warning: 'bg-status-warning',
  degraded: 'bg-status-error',
};

interface ServiceNodeData extends Record<string, unknown> {
  service: Service;
  selected?: boolean;
}

function ServiceNodeComponent({ data }: NodeProps & { data: ServiceNodeData }) {
  const { service, selected } = data;
  const Icon = typeIcons[service.type];
  const colorClass = typeColorClasses[service.type];
  const bgClass = typeBgClasses[service.type];

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-border !border-muted-foreground !w-2 !h-2" />
      <Handle type="target" position={Position.Left} className="!bg-border !border-muted-foreground !w-2 !h-2" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`
          relative cursor-pointer rounded-lg border bg-card p-3 min-w-[180px]
          transition-all duration-200
          ${colorClass}
          ${selected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}
        `}
      >
        {/* Status indicator */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusDotClasses[service.status]} ${service.status === 'healthy' ? '' : 'animate-pulse'}`} />
          <span className="text-[10px] font-mono text-muted-foreground">{service.metrics.rps.toLocaleString()} rps</span>
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded ${bgClass}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground leading-tight">{service.name}</div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{service.type}</div>
          </div>
        </div>

        {/* Metrics bar */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mt-1">
          <span>p50: {service.metrics.latencyP50}ms</span>
          <span>p99: {service.metrics.latencyP99}ms</span>
          <span>×{service.replicas}</span>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} className="!bg-border !border-muted-foreground !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-border !border-muted-foreground !w-2 !h-2" />
    </>
  );
}

export default memo(ServiceNodeComponent);

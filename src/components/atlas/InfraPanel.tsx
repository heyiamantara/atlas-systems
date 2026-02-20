import { motion } from 'framer-motion';
import type { Project, Service } from '@/data/projects';

interface InfraPanelProps {
  project: Project;
  onSelectService: (service: Service) => void;
}

const layerColors = [
  'border-node-gateway/40 bg-node-gateway/5',
  'border-node-api/40 bg-node-api/5',
  'border-node-queue/40 bg-node-queue/5',
  'border-node-db/40 bg-node-db/5',
];

export default function InfraPanel({ project, onSelectService }: InfraPanelProps) {
  return (
    <div className="w-[220px] border-r border-border bg-card/50 p-3 overflow-y-auto shrink-0">
      <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Infrastructure Layers</h3>

      <div className="space-y-2">
        {project.infraLayers.map((layer, idx) => (
          <motion.div
            key={layer.name}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded border p-2 ${layerColors[idx % layerColors.length]}`}
          >
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">{layer.name}</div>
            <div className="space-y-1">
              {layer.services.map((sId) => {
                const svc = project.services.find((s) => s.id === sId);
                if (!svc) return null;
                return (
                  <button
                    key={sId}
                    onClick={() => onSelectService(svc)}
                    className="w-full text-left text-[11px] font-mono text-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-0.5"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${svc.status === 'healthy' ? 'bg-status-healthy' : svc.status === 'warning' ? 'bg-status-warning' : 'bg-status-error'}`} />
                    {svc.name}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-4">
        <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Tags</h3>
        <div className="flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project description */}
      <div className="mt-4">
        <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Overview</h3>
        <p className="text-[11px] text-secondary-foreground leading-relaxed">{project.description}</p>
      </div>
    </div>
  );
}

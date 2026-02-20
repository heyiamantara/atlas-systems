import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { Activity, GitBranch, Layers, Radio } from 'lucide-react';

interface TopBarProps {
  selectedProject: Project | null;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export default function TopBar({ selectedProject, projects, onSelectProject }: TopBarProps) {
  return (
    <div className="h-12 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm font-bold text-gradient-primary tracking-tight">ATLAS</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono">distributed system explorer</span>
      </div>

      {/* Center: Project Tabs */}
      <div className="flex items-center gap-1">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProject(p)}
            className={`
              relative px-3 py-1.5 text-xs font-mono rounded transition-colors
              ${selectedProject?.id === p.id
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {p.name}
            {selectedProject?.id === p.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-secondary rounded"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Right: Metrics */}
      {selectedProject && (
        <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-primary" />
            <span>{selectedProject.totalRPS.toLocaleString()} rps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            <span>{selectedProject.services.length} services</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3 h-3" />
            <span>{selectedProject.deployFrequency}</span>
          </div>
        </div>
      )}
    </div>
  );
}

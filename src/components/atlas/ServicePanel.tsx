import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from '@/data/projects';
import { X, Activity, Clock, AlertTriangle, Server, MapPin } from 'lucide-react';

interface ServicePanelProps {
  service: Service | null;
  onClose: () => void;
}

export default function ServicePanel({ service, onClose }: ServicePanelProps) {
  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-0 right-0 h-full w-[380px] bg-card border-l border-border z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{service.name}</h3>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{service.type} · {service.region}</span>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Description */}
            <p className="text-xs text-secondary-foreground leading-relaxed">{service.description}</p>

            {/* Status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${service.status === 'healthy' ? 'bg-status-healthy' : service.status === 'warning' ? 'bg-status-warning' : 'bg-status-error'}`} />
              <span className="text-xs font-mono text-foreground capitalize">{service.status}</span>
              <span className="text-[10px] text-muted-foreground">· {service.metrics.uptime}% uptime</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard icon={Activity} label="Throughput" value={`${service.metrics.rps.toLocaleString()} rps`} />
              <MetricCard icon={Clock} label="Latency P50" value={`${service.metrics.latencyP50}ms`} />
              <MetricCard icon={Clock} label="Latency P99" value={`${service.metrics.latencyP99}ms`} />
              <MetricCard icon={AlertTriangle} label="Error Rate" value={`${service.metrics.errorRate}%`} />
              <MetricCard icon={Server} label="Replicas" value={`${service.replicas}`} />
              <MetricCard icon={MapPin} label="Region" value={service.region} />
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {service.tech.map((t) => (
                  <span key={t} className="text-[10px] font-mono bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Deploy */}
            <div className="border-t border-border pt-3">
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Last Deploy</h4>
              <span className="text-xs font-mono text-foreground">{service.lastDeploy}</span>
            </div>

            {/* Simulated Latency Chart */}
            <div>
              <h4 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">Latency Distribution</h4>
              <div className="flex items-end gap-[2px] h-16">
                {generateLatencyBars(service.metrics.latencyP50, service.metrics.latencyP99).map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                    className="flex-1 rounded-t bg-primary/40 min-w-[2px]"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded p-2.5 border border-border">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}

function generateLatencyBars(p50: number, p99: number): number[] {
  const bars: number[] = [];
  for (let i = 0; i < 30; i++) {
    const x = i / 30;
    // Log-normal-ish distribution
    const peak = 0.3;
    const spread = 0.2;
    const base = Math.exp(-Math.pow(x - peak, 2) / (2 * spread * spread));
    // Add a tail
    const tail = x > 0.6 ? Math.random() * 0.3 * (x - 0.5) : 0;
    bars.push(Math.max(5, (base + tail) * 100));
  }
  return bars;
}

export type ServiceType = 'api' | 'worker' | 'db' | 'queue' | 'ai' | 'gateway' | 'cache' | 'auth';
export type ServiceStatus = 'healthy' | 'warning' | 'degraded';

export interface ServiceMetrics {
  rps: number;
  latencyP50: number;
  latencyP99: number;
  errorRate: number;
  uptime: number;
}

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description: string;
  tech: string[];
  metrics: ServiceMetrics;
  status: ServiceStatus;
  replicas: number;
  region: string;
  lastDeploy: string;
}

export interface Dependency {
  source: string;
  target: string;
  protocol: string;
  label?: string;
  animated?: boolean;
}

export interface InfraLayer {
  name: string;
  services: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  services: Service[];
  dependencies: Dependency[];
  infraLayers: InfraLayer[];
  totalRPS: number;
  deployFrequency: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: 'realtime-ai-chat',
    name: 'Realtime AI Chat System',
    description: 'Multi-tenant conversational AI platform with streaming responses, vector search, and real-time message delivery across distributed WebSocket clusters.',
    status: 'active',
    totalRPS: 12400,
    deployFrequency: '~18 deploys/day',
    tags: ['AI/ML', 'Real-time', 'WebSockets', 'Vector DB'],
    services: [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'gateway',
        description: 'Rate-limited ingress with JWT validation, request routing, and circuit breaking. Handles all external traffic.',
        tech: ['Kong', 'Lua', 'OpenResty'],
        metrics: { rps: 8200, latencyP50: 3, latencyP99: 18, errorRate: 0.02, uptime: 99.99 },
        status: 'healthy',
        replicas: 4,
        region: 'us-east-1',
        lastDeploy: '2h ago',
      },
      {
        id: 'auth-service',
        name: 'Auth Service',
        type: 'auth',
        description: 'OAuth2/OIDC provider with MFA, session management, and RBAC. Issues short-lived JWTs with refresh rotation.',
        tech: ['Go', 'Redis', 'Postgres'],
        metrics: { rps: 1200, latencyP50: 8, latencyP99: 45, errorRate: 0.01, uptime: 99.99 },
        status: 'healthy',
        replicas: 3,
        region: 'us-east-1',
        lastDeploy: '6h ago',
      },
      {
        id: 'chat-service',
        name: 'Chat Service',
        type: 'api',
        description: 'Core message handling with WebSocket fan-out, presence tracking, and message persistence. Supports 50k concurrent connections per instance.',
        tech: ['Node.js', 'Socket.io', 'Redis Streams'],
        metrics: { rps: 4500, latencyP50: 5, latencyP99: 22, errorRate: 0.03, uptime: 99.97 },
        status: 'healthy',
        replicas: 6,
        region: 'us-east-1',
        lastDeploy: '45m ago',
      },
      {
        id: 'llm-service',
        name: 'LLM Orchestrator',
        type: 'ai',
        description: 'Model router with streaming inference, prompt caching, fallback chains, and token budget management across GPT-4, Claude, and local models.',
        tech: ['Python', 'FastAPI', 'vLLM', 'CUDA'],
        metrics: { rps: 850, latencyP50: 180, latencyP99: 2400, errorRate: 0.08, uptime: 99.91 },
        status: 'warning',
        replicas: 8,
        region: 'us-east-1',
        lastDeploy: '3h ago',
      },
      {
        id: 'vector-db',
        name: 'Vector Store',
        type: 'db',
        description: 'Embedding storage with ANN search, metadata filtering, and namespace isolation. 12M vectors indexed with HNSW.',
        tech: ['Qdrant', 'gRPC'],
        metrics: { rps: 2100, latencyP50: 12, latencyP99: 65, errorRate: 0.01, uptime: 99.98 },
        status: 'healthy',
        replicas: 3,
        region: 'us-east-1',
        lastDeploy: '2d ago',
      },
      {
        id: 'redis-queue',
        name: 'Message Queue',
        type: 'queue',
        description: 'Redis Streams-based task queue for async job processing, event sourcing, and cross-service communication with exactly-once delivery.',
        tech: ['Redis', 'BullMQ'],
        metrics: { rps: 6800, latencyP50: 1, latencyP99: 8, errorRate: 0.001, uptime: 99.99 },
        status: 'healthy',
        replicas: 3,
        region: 'us-east-1',
        lastDeploy: '5d ago',
      },
      {
        id: 'worker-pool',
        name: 'Worker Pool',
        type: 'worker',
        description: 'Async job processors for embedding generation, notification delivery, analytics aggregation, and scheduled tasks.',
        tech: ['Node.js', 'BullMQ', 'Sharp'],
        metrics: { rps: 3200, latencyP50: 45, latencyP99: 890, errorRate: 0.05, uptime: 99.95 },
        status: 'healthy',
        replicas: 10,
        region: 'us-east-1',
        lastDeploy: '1h ago',
      },
      {
        id: 'postgres-primary',
        name: 'Postgres Primary',
        type: 'db',
        description: 'Primary OLTP database with logical replication, partitioned tables, and connection pooling via PgBouncer.',
        tech: ['PostgreSQL 16', 'PgBouncer', 'WAL-G'],
        metrics: { rps: 5400, latencyP50: 2, latencyP99: 35, errorRate: 0.001, uptime: 99.999 },
        status: 'healthy',
        replicas: 1,
        region: 'us-east-1',
        lastDeploy: '14d ago',
      },
      {
        id: 'redis-cache',
        name: 'Redis Cache',
        type: 'cache',
        description: 'Multi-tier caching layer with session storage, rate limiting counters, and hot-path query caching. 98.2% hit rate.',
        tech: ['Redis Cluster', 'Sentinel'],
        metrics: { rps: 24000, latencyP50: 0.3, latencyP99: 2, errorRate: 0.0001, uptime: 99.999 },
        status: 'healthy',
        replicas: 6,
        region: 'us-east-1',
        lastDeploy: '7d ago',
      },
    ],
    dependencies: [
      { source: 'api-gateway', target: 'auth-service', protocol: 'gRPC', label: 'JWT Validation' },
      { source: 'api-gateway', target: 'chat-service', protocol: 'WebSocket', label: 'WS Upgrade', animated: true },
      { source: 'api-gateway', target: 'llm-service', protocol: 'HTTP/2', label: 'Inference' },
      { source: 'chat-service', target: 'redis-queue', protocol: 'Redis Streams', label: 'Events', animated: true },
      { source: 'chat-service', target: 'postgres-primary', protocol: 'TCP/pgBouncer', label: 'Persist' },
      { source: 'chat-service', target: 'redis-cache', protocol: 'Redis', label: 'Sessions' },
      { source: 'llm-service', target: 'vector-db', protocol: 'gRPC', label: 'RAG Lookup', animated: true },
      { source: 'llm-service', target: 'redis-cache', protocol: 'Redis', label: 'Prompt Cache' },
      { source: 'redis-queue', target: 'worker-pool', protocol: 'Redis Streams', label: 'Jobs', animated: true },
      { source: 'worker-pool', target: 'vector-db', protocol: 'gRPC', label: 'Embeddings' },
      { source: 'worker-pool', target: 'postgres-primary', protocol: 'TCP', label: 'Write' },
      { source: 'auth-service', target: 'redis-cache', protocol: 'Redis', label: 'Sessions' },
      { source: 'auth-service', target: 'postgres-primary', protocol: 'TCP', label: 'Users' },
    ],
    infraLayers: [
      { name: 'Edge / CDN', services: ['api-gateway'] },
      { name: 'Application', services: ['auth-service', 'chat-service', 'llm-service'] },
      { name: 'Processing', services: ['redis-queue', 'worker-pool'] },
      { name: 'Data', services: ['postgres-primary', 'vector-db', 'redis-cache'] },
    ],
  },
  {
    id: 'ml-pipeline',
    name: 'ML Feature Pipeline',
    description: 'End-to-end feature engineering platform processing 2TB/day of event data into real-time and batch feature stores for model training and serving.',
    status: 'active',
    totalRPS: 45000,
    deployFrequency: '~6 deploys/day',
    tags: ['Data Engineering', 'ML', 'Streaming', 'Batch'],
    services: [
      {
        id: 'ingestion-api',
        name: 'Ingestion API',
        type: 'gateway',
        description: 'High-throughput event collector with schema validation, deduplication, and back-pressure handling.',
        tech: ['Go', 'Protocol Buffers'],
        metrics: { rps: 45000, latencyP50: 1, latencyP99: 5, errorRate: 0.001, uptime: 99.99 },
        status: 'healthy',
        replicas: 8,
        region: 'us-west-2',
        lastDeploy: '4h ago',
      },
      {
        id: 'stream-processor',
        name: 'Stream Processor',
        type: 'worker',
        description: 'Apache Flink-based stream processing with windowed aggregations, CEP, and exactly-once semantics.',
        tech: ['Flink', 'Java', 'Kafka Streams'],
        metrics: { rps: 38000, latencyP50: 15, latencyP99: 120, errorRate: 0.01, uptime: 99.95 },
        status: 'healthy',
        replicas: 12,
        region: 'us-west-2',
        lastDeploy: '8h ago',
      },
      {
        id: 'kafka-cluster',
        name: 'Kafka Cluster',
        type: 'queue',
        description: '24-node Kafka cluster with 3x replication, tiered storage, and cross-region mirroring.',
        tech: ['Apache Kafka', 'KRaft', 'S3 Tiered'],
        metrics: { rps: 92000, latencyP50: 2, latencyP99: 12, errorRate: 0.0001, uptime: 99.999 },
        status: 'healthy',
        replicas: 24,
        region: 'us-west-2',
        lastDeploy: '30d ago',
      },
      {
        id: 'feature-store',
        name: 'Feature Store',
        type: 'db',
        description: 'Dual-layer feature store with Redis for online serving (<5ms) and Parquet/S3 for offline training.',
        tech: ['Feast', 'Redis', 'Apache Parquet'],
        metrics: { rps: 15000, latencyP50: 3, latencyP99: 18, errorRate: 0.005, uptime: 99.98 },
        status: 'healthy',
        replicas: 6,
        region: 'us-west-2',
        lastDeploy: '1d ago',
      },
      {
        id: 'model-registry',
        name: 'Model Registry',
        type: 'api',
        description: 'Versioned model artifact storage with lineage tracking, A/B deployment configs, and automated canary analysis.',
        tech: ['MLflow', 'Python', 'S3'],
        metrics: { rps: 120, latencyP50: 25, latencyP99: 200, errorRate: 0.02, uptime: 99.95 },
        status: 'healthy',
        replicas: 2,
        region: 'us-west-2',
        lastDeploy: '12h ago',
      },
      {
        id: 'training-orchestrator',
        name: 'Training Orchestrator',
        type: 'ai',
        description: 'Kubernetes-native training job orchestrator with GPU scheduling, hyperparameter tuning, and distributed training.',
        tech: ['Kubeflow', 'Ray', 'PyTorch'],
        metrics: { rps: 45, latencyP50: 500, latencyP99: 8000, errorRate: 0.1, uptime: 99.8 },
        status: 'warning',
        replicas: 4,
        region: 'us-west-2',
        lastDeploy: '2d ago',
      },
    ],
    dependencies: [
      { source: 'ingestion-api', target: 'kafka-cluster', protocol: 'Kafka Producer', label: 'Events', animated: true },
      { source: 'kafka-cluster', target: 'stream-processor', protocol: 'Kafka Consumer', label: 'Consume', animated: true },
      { source: 'stream-processor', target: 'feature-store', protocol: 'gRPC', label: 'Features' },
      { source: 'feature-store', target: 'model-registry', protocol: 'HTTP', label: 'Serve' },
      { source: 'model-registry', target: 'training-orchestrator', protocol: 'gRPC', label: 'Train', animated: true },
      { source: 'training-orchestrator', target: 'feature-store', protocol: 'S3/HTTP', label: 'Read' },
    ],
    infraLayers: [
      { name: 'Ingestion', services: ['ingestion-api'] },
      { name: 'Streaming', services: ['kafka-cluster', 'stream-processor'] },
      { name: 'Storage', services: ['feature-store', 'model-registry'] },
      { name: 'Compute', services: ['training-orchestrator'] },
    ],
  },
];

export const serviceTypeColors: Record<ServiceType, string> = {
  api: 'var(--node-api)',
  db: 'var(--node-db)',
  queue: 'var(--node-queue)',
  worker: 'var(--node-worker)',
  ai: 'var(--node-ai)',
  gateway: 'var(--node-gateway)',
  cache: 'var(--node-cache)',
  auth: 'var(--node-auth)',
};

export const serviceTypeLabels: Record<ServiceType, string> = {
  api: 'API',
  db: 'Database',
  queue: 'Queue',
  worker: 'Worker',
  ai: 'AI/ML',
  gateway: 'Gateway',
  cache: 'Cache',
  auth: 'Auth',
};

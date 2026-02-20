import { useState } from 'react';
import { projects, type Project } from '@/data/projects';
import TopBar from '@/components/atlas/TopBar';
import SystemGraph from '@/components/atlas/SystemGraph';

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopBar
        selectedProject={selectedProject}
        projects={projects}
        onSelectProject={setSelectedProject}
      />
      <SystemGraph project={selectedProject} />
    </div>
  );
};

export default Index;

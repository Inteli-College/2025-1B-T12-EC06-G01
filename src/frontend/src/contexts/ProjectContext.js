import { createContext, useContext, useEffect, useState } from 'react';

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [project, setProjectState] = useState({
    name: '',
    contractor: '',
    date: ''
  });

  // Carregar do localStorage na primeira vez
  useEffect(() => {
    const storedProject = localStorage.getItem('currentProject');
    if (storedProject) {
      setProjectState(JSON.parse(storedProject));
    }
  }, []);

  // Salvar no localStorage sempre que mudar
  const setProject = (newProject) => {
    setProjectState(newProject);
    localStorage.setItem('currentProject', JSON.stringify(newProject));
  };

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}

import React, { createContext, useState, useEffect } from "react";

export const ProjectsContext = createContext();
export function ProjectsProvider({ children }) {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("/projects")
            .then((r) => {
                if (r.ok) {
                    return r.json();
                }
            })
            .then(setProjects)
            .catch((err) => console.error(err));
    }, []);

    function deleteProject(id) {
            setProjects((prev) => prev.filter((proj) => proj.id !== id));
    }

    function updateProject(updated) {
        setProjects((prev) => prev.map((proj) => (proj.id === updated.id ? updated : proj)) );
    }

    function addProject(newProject) {
        setProjects((prev) => [...prev, newProject]);
    }

    const value = {
        projects,
        setProjects,  
        deleteProject,
        updateProject,
        addProject,
    };

  return (
    <ProjectsContext.Provider value={value}>
        {children}
    </ProjectsContext.Provider>
  );
}
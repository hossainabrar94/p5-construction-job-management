import React, { useContext, useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "../pages/Hero";
import Footer from "./Footer";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";
import CreateProjectPage from "../pages/CreateProjectPage";
import ProjectDetailPage from "../pages/ProjectDetailPage";
import CostEstimationForm from "./CostEstimationForm";
import MyProjectsPage from "../pages/MyProjectsPage";
import { ProjectsContext } from "./ProjectsContext";


function App() {
  const [user, setUser] = useState(null);
  const { projects, setProjects, addProject, deleteProject, updateProject } = useContext(ProjectsContext);
  // const [projects, setProjects] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((loggedInUser) => {
          setUser(loggedInUser);
          fetch("/projects")
            .then((r) => r.json())
            .then((data) => {
              setProjects(data);
            });
        });
      } else {
        console.log("User not logged in");
      }
    });
    }, []);

  function handleAddedProject(newProject) {
    setProjects((prev) => [...prev, newProject])  
  }

  function handleUpdatedProject(updatedProject) {
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
  }

  return (
    <div>
      <Navbar user={user} setUser={setUser}/>
      <Switch>
        <Route exact path="/">
          { user ? (<HomePage user={user} projects={projects}/>) : (<Hero/> )}
        </Route>
        <Route path="/login">
          <LoginPage onLogin={setUser} />
        </Route>
        <Route path ="/signup">
          <SignUpPage onSignUp = {setUser}/>
        </Route>
        <Route path ="/create-project">
          <CreateProjectPage user = {user} projects = {projects} handleAddedProject={handleAddedProject}/>
        </Route>
        <Route exact path="/projects">
          <MyProjectsPage user={user} projects={projects} />
        </Route>
        <Route exact path="/projects/:id">
          <ProjectDetailPage user={user} onProjectUpdate={handleUpdatedProject} setProjects = {setProjects}/>
        </Route>
        <Route path="/projects/:id/cost-estimate">
          <CostEstimationForm user={user} onUpdatedProject={handleUpdatedProject}/>
        </Route>
      </Switch>
      <div className="mt-36" />
        <Footer />
    </div>
  );
}

export default App;
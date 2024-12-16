import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "../pages/Hero";
import Footer from "./Footer";
import LoginPage from "../pages/LoginPage";

function App() {

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([])

  useEffect(() => {
    // auto-login
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => {
          setUser(user);
          fetch('/projects')
          .then((r) => r.json());
        })
      }
      else {
        console.log('User not logged in')
      }
    });

    // Fetch all projects
    fetch("/projects")
    .then((r) => r.json())
    .then(setProjects)
  }, []);

  return (
    <div>
      <main>
        <Navbar />
        <Switch>
          <Route path ="/">
              <Hero/>
          </Route>
          <Route path ="/login">
              <LoginPage onLogin = {setUser}/>
          </Route>
        </Switch>
        <Footer />
      </main>
    </div>
  )
}

export default App;

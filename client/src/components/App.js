import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Hero from "../pages/Hero";
import Footer from "./Footer";
import LoginPage from "../pages/LoginPage";

function App() {
  return (
    <div>
      <Navbar />
      <Switch>
        <Route path="/" element={<Hero />}/>
        <Route path="/login" element={<LoginPage />} />
      </Switch>
      <Hero />
      <Footer />
    </div>
  )
}

export default App;

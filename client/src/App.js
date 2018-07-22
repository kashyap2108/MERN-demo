import React, { Component } from "react";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Landing />
        <h1>My React App</h1>
        <Footer />
      </div>
    );
  }
}

export default App;

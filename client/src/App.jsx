import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log("Loading User");
    fetch("/api/check-session")
      .then((r) => r.json())
      .then((data) => {
        if (data.email_address) {
          setUser(data);
        }
      });
  }, []);

  return (
    <div className="appContainer">
      <header className="App-header">
        <NavBar {...{ user, setUser }} />
      </header>
      <Outlet context={{ user, setUser }} />
    </div>
  );
}

export default App;

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MenuItem, Menu, Button } from "semantic-ui-react";
import "../App.css";

function NavBar({ user, setUser }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const navigate = useNavigate();

  function handleItemClick(e, { name }) {
    setActiveItem(name);
  }

  function handleLogoutClick() {
    fetch("/api/logout", {
      method: "DELETE",
    }).then(() => {
      setUser({});
      navigate("/login");
    });
  }

  return (
    <Menu fixed="top" className="navBar" fluid>
      <MenuItem
        name="dashboard"
        as={NavLink}
        to="/"
        className="nav-link"
        onClick={handleItemClick}
      >
        Dashboard
      </MenuItem>
      <MenuItem
        name="reports"
        as={NavLink}
        to="/reports"
        className="nav-link"
        onClick={handleItemClick}
      >
        Reports
      </MenuItem>
      <MenuItem
        name="placements"
        as={NavLink}
        to="/placements"
        className="nav-link"
        onClick={handleItemClick}
      >
        Placements
      </MenuItem>
      <MenuItem
        name="suggestions"
        as={NavLink}
        to="/suggestions"
        className="nav-link"
        onClick={handleItemClick}
      >
        Suggestions
      </MenuItem>
      <MenuItem
        name="instructors"
        as={NavLink}
        to="/instructors"
        className="nav-link"
        onClick={handleItemClick}
      >
        Instructors
      </MenuItem>
      <MenuItem
        name="courses"
        as={NavLink}
        to="/courses"
        className="nav-link"
        onClick={handleItemClick}
      >
        Courses
      </MenuItem>
      <MenuItem
        name="students"
        as={NavLink}
        to="/students"
        className="nav-link"
        onClick={handleItemClick}
      >
        Students
      </MenuItem>
      <MenuItem
        name="emails"
        as={NavLink}
        to="/emails"
        className="nav-link"
        onClick={handleItemClick}
      >
        Emails
      </MenuItem>
      <MenuItem
        name="profile"
        as={NavLink}
        to="/profile"
        className="nav-link"
        onClick={handleItemClick}
      >
        Profile
      </MenuItem>
      {user.id ? (
        <Button onClick={handleLogoutClick}>Logout</Button>
      ) : (
        <MenuItem
          name="login"
          as={NavLink}
          to="/login"
          className="nav-link"
          onClick={handleItemClick}
        >
          Login
        </MenuItem>
      )}
    </Menu>
  );
}

export default NavBar;

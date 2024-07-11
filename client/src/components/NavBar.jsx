import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MenuItem, Menu, Button } from "semantic-ui-react";
import { useOutletContext } from "react-router-dom";
import "../App.css";

function NavBar({ user, setUser }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  const userRoles = user.roles ? user.roles.map((role) => role.name) : [];

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
      <h3>MyDanceSchoolApp</h3>
      {userRoles.includes("Admin") && (
        <MenuItem
          name="dashboard"
          as={NavLink}
          to="/"
          className="nav-link"
          onClick={handleItemClick}
        >
          Dashboard
        </MenuItem>
      )}
      <MenuItem
        name="reports"
        as={NavLink}
        to="/reports"
        className="nav-link"
        onClick={handleItemClick}
      >
        Reports
      </MenuItem>
      {userRoles.includes("Admin") && (
        <MenuItem
          name="placements"
          as={NavLink}
          to="/placements"
          className="nav-link"
          onClick={handleItemClick}
        >
          Placements
        </MenuItem>
      )}
      {userRoles.includes("Admin") && (
        <MenuItem
          name="suggestions"
          as={NavLink}
          to="/suggestions"
          className="nav-link"
          onClick={handleItemClick}
        >
          Suggestions
        </MenuItem>
      )}
      {userRoles.includes("Admin") && (
        <MenuItem
          name="instructors"
          as={NavLink}
          to="/instructors"
          className="nav-link"
          onClick={handleItemClick}
        >
          Instructors
        </MenuItem>
      )}
      {userRoles.includes("Admin") && (
        <MenuItem
          name="courses"
          as={NavLink}
          to="/courses"
          className="nav-link"
          onClick={handleItemClick}
        >
          Courses
        </MenuItem>
      )}
      {userRoles.includes("Admin") && (
        <MenuItem
          name="students"
          as={NavLink}
          to="/students"
          className="nav-link"
          onClick={handleItemClick}
        >
          Students
        </MenuItem>
      )}
      {userRoles.includes("Admin") && (
        <MenuItem
          name="emails"
          as={NavLink}
          to="/emails"
          className="nav-link"
          onClick={handleItemClick}
        >
          Emails
        </MenuItem>
      )}
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

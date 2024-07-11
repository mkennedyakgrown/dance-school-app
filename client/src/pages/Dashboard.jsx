import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Header } from "semantic-ui-react";
import Admin from "./Admin.jsx";

// Dashboard component for the admin dashboard page
function Dashboard() {
  // Get the user from the context
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
  }, [user]);

  return (
    <>
      <Header as="h1">Dashboard</Header>
      <br />
      <div>{user.email_address ? <Admin /> : null}</div>
    </>
  );
}

export default Dashboard;

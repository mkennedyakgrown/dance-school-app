import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Header } from "semantic-ui-react";
import Admin from "./Admin.jsx";

function Dashboard() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.email_address) {
      navigate("/login");
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

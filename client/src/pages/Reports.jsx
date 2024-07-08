import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import ReportsAdmin from "../components/ReportsAdmin";
import ReportsInstructor from "../components/ReportsInstructor";
import { Button, Grid, Header } from "semantic-ui-react";

function Reports() {
  const [instructorView, setInstructorView] = useState(false);
  const { user } = useOutletContext();
  const userRoles = user.roles ? user.roles.map((role) => role.name) : [];

  return (
    <>
      <Grid centered>
        <Grid.Row>
          <Header as="h1" textAlign="center">
            Reports
          </Header>
        </Grid.Row>
        <Grid.Row>
          <Button
            type="button"
            onClick={() => setInstructorView(!instructorView)}
          >
            {!instructorView ? "View as Instructor" : "View as Admin"}
          </Button>
        </Grid.Row>
        <Grid.Row>
          {userRoles.includes("Admin") && !instructorView ? (
            <ReportsAdmin />
          ) : (
            <ReportsInstructor user={user} />
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Reports;

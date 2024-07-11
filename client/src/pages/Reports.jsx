import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import ReportsAdmin from "../components/ReportsAdmin";
import ReportsInstructor from "../components/ReportsInstructor";
import { Button, Grid, Header } from "semantic-ui-react";

/**
 * This component handles the reports page where the user can view reports as either an admin or instructor.
 * If the user is an admin, they can choose to view the reports as an instructor to see the reports from the instructor's perspective.
 * The user can toggle between the two views using the button.
 */
function Reports() {
  // State to keep track of whether the user wants to view the reports as an instructor or an admin
  const [instructorView, setInstructorView] = useState(false);
  // Get the user from the context
  const { user } = useOutletContext();
  // Get the user's roles and convert them to an array of strings
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
          {/* If the user is an admin, show a button to toggle between views */}
          {userRoles.includes("Admin") ? (
            <Button
              type="button"
              onClick={() => setInstructorView(!instructorView)}
            >
              {/* If the user is currently viewing the reports as an admin, show a button to switch to the instructor view */}
              {!instructorView ? "View as Instructor" : "View as Admin"}
            </Button>
          ) : null}
        </Grid.Row>
        <Grid.Row>
          {/* If the user is an admin and is not viewing the reports as an instructor, show the admin view */}
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

// Import necessary React hooks and components
import { useState, useEffect } from "react";
import {
  Header,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableBody,
  Icon,
} from "semantic-ui-react";
import { useOutletContext, useNavigate } from "react-router-dom";
import InstructorRow from "../components/InstructorRow";
import InstructorRowNew from "../components/InstructorRowNew";

// Define the Instructors component
function Instructors() {
  // Define state variables for instructors, courses, and roles
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sortSelection, setSortSelection] = useState("");

  // Get user information from the router context
  const { user } = useOutletContext();

  // Define a function to navigate to different pages
  const navigate = useNavigate();

  // Use the useEffect hook to fetch data from the API on component mount
  useEffect(() => {
    // If the user is not logged in, navigate to the login page
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    // Fetch instructors and update the state variable
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setInstructors(data);
      });
    // Fetch courses and update the state variable
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    // Fetch roles and update the state variable
    fetch("/api/roles")
      .then((r) => r.json())
      .then((data) => {
        setRoles(data);
      });
  }, []);

  // Create an array of dropdown options based on the courses state variable
  const courseOptions =
    courses.length > 0
      ? courses.map((course) => {
          return {
            key: course.id,
            text: course.name,
            value: course.id,
          };
        })
      : [];

  // Create an array of dropdown options based on the roles state variable
  const rolesOptions =
    roles.length > 0
      ? roles.map((role) => {
          return {
            key: role.id,
            text: role.name,
            value: role.id,
          };
        })
      : [];

  // Create an array of InstructorRow components based on the instructors state variable
  const instructorRows =
    instructors.length > 0
      ? instructors.map((instructor) => {
          return (
            <InstructorRow
              key={instructor.id}
              {...{
                instructor,
                instructors,
                setInstructors,
                courseOptions,
                roles,
                courses,
              }}
            />
          );
        })
      : [];

  // Define a function to sort instructors by first name
  function sortInstructorsByFirstName() {
    const sortedInstructors = [...instructors];
    sortedInstructors.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name > b.first_name) {
        return 1;
      }
      return 0;
    });
    setInstructors(sortedInstructors);
    setSortSelection("first_name");
  }

  // Define a function to sort instructors by last name
  function sortInstructorsByLastName() {
    const sortedInstructors = [...instructors];
    sortedInstructors.sort((a, b) => {
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }
      return 0;
    });
    setInstructors(sortedInstructors);
    setSortSelection("last_name");
  }

  // Render the Instructors component
  return (
    <>
      <Header as="h1">Instructors</Header>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell onClick={() => sortInstructorsByFirstName()}>
              First Name
              {sortSelection === "first_name" ? (
                <Icon name="carat arrow down" />
              ) : null}
            </TableHeaderCell>
            <TableHeaderCell onClick={() => sortInstructorsByLastName()}>
              Last Name
              {sortSelection === "last_name" ? (
                <Icon name="carat arrow down" />
              ) : null}
            </TableHeaderCell>
            <TableHeaderCell>Roles</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Courses</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InstructorRowNew
            key={"new-instructor-row"}
            {...{
              instructors,
              setInstructors,
              courseOptions,
              roles,
              courses,
            }}
          />
          {instructorRows}
        </TableBody>
      </Table>
    </>
  );
}

// Export the Instructors component
export default Instructors;

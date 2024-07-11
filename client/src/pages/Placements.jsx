// This is a React component for the Placements page.

// Import necessary dependencies
import { useState, useEffect } from "react";
import { Header, Dropdown, Grid } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CoursePlacement from "../components/CoursePlacement";

// Define the Placements component
function Placements() {
  // Define state variables for disciplines, students, and courses
  const [disciplines, setDisciplines] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

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
    // Fetch disciplines and update the state variable
    fetch("/api/disciplines")
      .then((r) => r.json())
      .then((data) => {
        setDisciplines(data);
      });
    // Fetch students and update the state variable
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  // Create an array of dropdown options based on the disciplines state variable
  const dropdownOptions =
    disciplines.length > 0
      ? disciplines.map((discipline) => {
          return {
            key: discipline.id,
            text: discipline.name,
            value: discipline.id,
          };
        })
      : [];

  // Create an array of CoursePlacement components based on the courses state variable
  const courseColumns =
    courses.length > 0
      ? courses.map((course) => (
          <CoursePlacement
            key={course.id}
            {...{ course, students, courses, setCourses }}
          />
        ))
      : [];

  // Return the JSX for the Placements component
  return (
    <>
      <Header as="h1">Placements</Header>
      <Dropdown
        placeholder="Select a Discipline"
        name="discipline"
        floating
        search
        selection
        options={dropdownOptions}
        onChange={(e, { value }) => {
          setCourses(disciplines.find((d) => d.id === value).courses);
        }}
      />
      <Grid divided>{courseColumns}</Grid>
    </>
  );
}

// Export the Placements component as the default export
export default Placements;

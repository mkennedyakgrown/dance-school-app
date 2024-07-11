import { useState, useEffect } from "react";
import { Header, Dropdown, Grid } from "semantic-ui-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import CoursePlacement from "../components/CoursePlacement";

function Placements() {
  const [disciplines, setDisciplines] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const { user } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    fetch("/api/disciplines")
      .then((r) => r.json())
      .then((data) => {
        setDisciplines(data);
      });
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

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

  const courseColumns =
    courses.length > 0
      ? courses.map((course) => (
          <CoursePlacement
            key={course.id}
            {...{ course, students, courses, setCourses }}
          />
        ))
      : [];

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

export default Placements;

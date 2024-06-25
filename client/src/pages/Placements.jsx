import { useState, useEffect } from "react";
import { Header, Dropdown, Grid } from "semantic-ui-react";
import CoursePlacement from "../components/CoursePlacement";

function Placements() {
  const [disciplines, setDisciplines] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
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

  const studentOptions =
    students.length > 0
      ? students.map((student) => {
          return {
            key: student.id,
            text: `${student.first_name} ${student.last_name}`,
            value: student.id,
          };
        })
      : [];

  const courseColumns =
    courses.length > 0
      ? courses.map((course) => (
          <CoursePlacement key={course.id} {...{ course, students }} />
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
          setCourses(disciplines[value].courses);
          console.log(disciplines[value]);
        }}
      />
      <Grid divided>{courseColumns}</Grid>
    </>
  );
}

export default Placements;

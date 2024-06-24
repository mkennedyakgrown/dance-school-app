import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Header,
  Dropdown,
  Grid,
  GridColumn,
  Segment,
  Button,
  List,
} from "semantic-ui-react";
import { Form } from "react-router-dom";
import "../App.css";

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
      ? courses.map((course) => {
          return [
            <GridColumn width="4" key={course.id}>
              <Segment as="h3">{course.name}</Segment>
              <List key={`students-${course.id}`}>
                {course.students.map((student) => {
                  return (
                    <List.Item
                      key={`course-${course.id}student-${student.id}`}
                    >{`${student.first_name} ${student.last_name}`}</List.Item>
                  );
                })}
              </List>
              <Dropdown
                lazyLoad
                search
                placeholder="Add a Student"
                name="add-student"
                options={studentOptions}
              />
              <Button color="green">Add Student</Button>
            </GridColumn>,
          ];
        })
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

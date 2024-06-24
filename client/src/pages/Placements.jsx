import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Header,
  Dropdown,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "semantic-ui-react";

function Placements() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses);
      });
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data.students);
      });
  }, []);

  console.log(courses);
  console.log(students);

  const dropdown =
    courses.length > 0
      ? courses.map((course) => {
          return (
            <Dropdown
              key={course.id}
              placeholder={course.name}
              fluid
              selection
              options={students.map((student) => {
                return {
                  key: student.id,
                  text: `${student.first_name} ${student.last_name}`,
                  value: student.id,
                };
              })}
            />
          );
        })
      : [];

  return (
    <>
      <Header as="h1">Placements</Header>
    </>
  );
}

export default Placements;

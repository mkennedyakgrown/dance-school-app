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
import { Form } from "react-router-dom";

function Placements() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  const dropdownOptions =
    courses.length > 0
      ? courses.map((course) => {
          return {
            key: course.id,
            text: course.name,
            value: course.id,
          };
        })
      : [];

  return (
    <>
      <Header as="h1">Placements</Header>
      <Dropdown
        placeholder="Select a course"
        floating
        search
        selection
        options={dropdownOptions}
      />
    </>
  );
}

export default Placements;

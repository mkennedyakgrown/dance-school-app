import { useState, useEffect } from "react";
import { Dropdown, Header, Button, Grid, GridRow } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useOutletContext, useNavigate } from "react-router-dom";

import EditStudentForm from "../components/EditStudentForm";

// Component for managing students
function Students() {
  // State for students, courses, and genders
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [genders, setGenders] = useState([]);

  // User object from outlet context
  const { user } = useOutletContext();

  // Navigate function for redirecting
  const navigate = useNavigate();

  // Fetch students, courses, and genders on mount
  useEffect(() => {
    if (!user.email_address) {
      // Redirect to login if user is not logged in
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      // Redirect to reports if user is not an admin
      navigate("/reports");
    }
    // Fetch students
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
    // Fetch courses
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    // Fetch genders
    fetch("/api/genders")
      .then((r) => r.json())
      .then((data) => {
        setGenders(data);
      });
  }, []);

  // Form schema for formik
  const formSchema = yup.object().shape({
    id: yup.number().required(),
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    email_address: yup.string().required(),
    secondary_email_address: yup.string(),
    birth_date: yup.date().required(),
    gender_id: yup.number(),
    courses: yup.array().of(yup.number()),
    placements: yup.array().of(yup.object()),
    delete_placements: yup.array().of(yup.number()),
  });

  // Formik instance for student form
  const formik = useFormik({
    initialValues: {
      id: null,
      first_name: "",
      last_name: "",
      email_address: "",
      secondary_email_address: "",
      birth_date: "",
      gender_id: 0,
      courses: [],
      placements: [],
      delete_placements: [],
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      if (values.id != 0) {
        // Patch student if id is not 0
        fetch(`/api/students/${values.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((r) => r.json())
          .then((data) => {
            // Update state with new student data
            setStudents(
              students.map((student) => {
                if (student.id === data.id) {
                  return data;
                } else {
                  return student;
                }
              })
            );
            // Set formik values to new student data
            formik.setValues({
              key: data.id,
              text: `${data.first_name} ${data.last_name}`,
              value: data.id,
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email_address: data.email_address,
              secondary_email_address: data.secondary_email_address,
              birth_date: data.birth_date,
              gender_id: data.gender_id,
              courses: data.courses.map((c) => c.id),
              placements: data.placements.map((p) => {
                return {
                  id: p.id,
                  course_id: p.course.id,
                };
              }),
              delete_placements: [],
            });
            // Alert success
            alert("Student changes saved successfully!");
          });
      } else {
        // Post new student if id is 0
        fetch("/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((r) => r.json())
          .then((data) => {
            // Add new student to state
            setStudents([...students, data]);
            // Set formik values to new student data
            formik.setValues({
              key: data.id,
              text: `${data.first_name} ${data.last_name}`,
              value: data.id,
              id: data.id,
              first_name: data.first_name,
              last_name: data.last_name,
              email_address: data.email_address,
              secondary_email_address: data.secondary_email_address,
              birth_date: data.birth_date,
              gender_id: data.gender_id,
              courses: data.courses.map((c) => c.id),
              placements: data.placements.map((p) => {
                return {
                  id: p.id,
                  course_id: p.course.id,
                };
              }),
              delete_placements: [],
            });
            // Alert success
            alert(
              `Student ${data.first_name} ${data.last_name} created successfully!`
            );
          });
      }
    },
  });

  // Dropdown options for selecting a student
  const studentOptions = [
    {
      key: 0,
      text: "Create New Student",
      value: 0,
      id: 0,
      first_name: "",
      last_name: "",
      email_address: "",
      secondary_email_address: "",
      birth_date: "",
      gender_id: 0,
      courses: [],
      placements: [],
      delete_placements: [],
    },
    ...(students.length > 0
      ? students.map((student) => {
          return {
            key: student.id,
            text: `${student.first_name} ${student.last_name}`,
            value: student.id,
            id: student.id,
            first_name: student.first_name,
            last_name: student.last_name,
            email_address: student.email_address,
            secondary_email_address: student.secondary_email_address,
            birth_date: student.birth_date,
            gender_id: student.gender_id,
            courses: student.courses.map((c) => c.id),
            placements: student.placements.map((p) => {
              return {
                id: p.id,
                course_id: p.course.id,
              };
            }),
            delete_placements: [],
          };
        })
      : []),
  ];

  // Return JSX for page
  return (
    <>
      <Header as="h1">Students</Header>
      <Grid>
        <GridRow centered>
          <Dropdown
            placeholder="Select Student"
            search
            selection
            options={studentOptions}
            value={formik.values.id}
            onChange={(e, { value }) => {
              formik.setValues(studentOptions.find((o) => o.value === value));
            }}
          />
          <Button color="grey" type="button" onClick={() => formik.resetForm()}>
            Clear Form
          </Button>
        </GridRow>
        <GridRow>
          <EditStudentForm
            {...{ formik, courses, genders, students, setStudents }}
          />
        </GridRow>
      </Grid>
    </>
  );
}

export default Students;

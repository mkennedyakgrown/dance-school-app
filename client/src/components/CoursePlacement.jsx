import { useState, useEffect } from "react";
import { Dropdown, List, Segment, GridColumn, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";

function CoursePlacement({ course, students }) {
  const [currCourse, setCurrCourse] = useState({ ...course });

  const formSchema = yup.object().shape({
    add_student_id: yup.number().required(),
  });

  const formSchemaRemove = yup.object().shape({
    remove_student_id: yup.number().required(),
  });

  const formik = useFormik({
    initialValues: {
      student_id: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/api/courses/${currCourse.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ student_ids: [values.add_student_id] }),
      })
        .then((r) => r.json())
        .then((data) => setCurrCourse(data));
    },
  });

  const formikRemove = useFormik({
    initialValues: {
      remove_student_id: "",
    },
    validationSchema: formSchemaRemove,
    onSubmit: (values) => {
      fetch(`/api/courses/${currCourse.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remove_student_ids: [values.remove_student_id],
        }),
      })
        .then((r) => r.json())
        .then((data) => setCurrCourse(data));
    },
  });

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

  return (
    <GridColumn width="4" key={currCourse.id}>
      <Segment as="h3">{currCourse.name}</Segment>
      <List key={`students-${currCourse.id}`}>
        {currCourse.students.map((student) => {
          return (
            <List.Item
              key={`course-${currCourse.id}student-${student.id}`}
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
        onChange={(e, { value }) => {
          formik.setFieldValue("add_student_id", value);
          console.log(formik.values);
        }}
      />
      <Button color="green" type="submit" onClick={formik.handleSubmit}>
        Add Student
      </Button>
    </GridColumn>
  );
}

export default CoursePlacement;

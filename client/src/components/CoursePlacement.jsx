import { useState, useEffect } from "react";
import { Dropdown, List, Segment, GridColumn, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import PlacementStudentListItem from "./PlacementStudentListItem";

function CoursePlacement({ course, students }) {
  const [currCourse, setCurrCourse] = useState({ ...course });

  const formSchema = yup.object().shape({
    add_student_id: yup.number().required(),
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
        .then((data) => {
          setCurrCourse(data);
          formik.resetForm();
        });
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
      <List key={`students-${currCourse.id}`} selection>
        {currCourse.students.map((student) => {
          return (
            <PlacementStudentListItem
              key={`student-${student.id}`}
              {...{ student, currCourse, setCurrCourse }}
            />
          );
        })}
      </List>
      <Dropdown
        lazyLoad
        search
        placeholder="Add a Student"
        name="add-student"
        options={studentOptions}
        value={formik.values.add_student_id}
        onChange={(e, { value }) => {
          formik.setFieldValue("add_student_id", value);
        }}
      />
      <Button color="green" type="submit" onClick={formik.handleSubmit}>
        Add Student
      </Button>
    </GridColumn>
  );
}

export default CoursePlacement;

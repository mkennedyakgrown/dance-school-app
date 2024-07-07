import { useState, useEffect } from "react";
import { Dropdown, List, Segment, GridColumn, Button } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import PlacementStudentListItem from "./PlacementStudentListItem";

function CoursePlacement({ course, students, courses, setCourses }) {
  const [currCourse, setCurrCourse] = useState({ ...course });

  const formSchema = yup.object().shape({
    course_id: yup.number().required(),
    add_student_id: yup.number().required(),
  });

  const formik = useFormik({
    initialValues: {
      course_id: course.id,
      add_student_id: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch("/api/placements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_id: course.id,
          student_id: values.add_student_id,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          setCurrCourse({
            ...currCourse,
            placements: [...currCourse.placements, data],
          });
          formik.resetForm();
        });
    },
  });

  console.log(currCourse);

  const courseStudentsIds =
    currCourse.placements.length > 0
      ? currCourse.placements.map((placement) => placement.student.id)
      : [];
  const studentOptions =
    students.length > 0
      ? students
          .filter((student) => !courseStudentsIds.includes(student.id))
          .map((student) => {
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
        {currCourse.placements.map((placement) => {
          return (
            <PlacementStudentListItem
              key={`student-${placement.student.id}`}
              {...{ placement, currCourse, setCurrCourse }}
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

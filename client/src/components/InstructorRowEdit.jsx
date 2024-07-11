import {
  TableRow,
  TableCell,
  Button,
  Icon,
  Input,
  Dropdown,
  List,
  Checkbox,
} from "semantic-ui-react";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DeleteInstructorButton from "./DeleteInstructorButton";

function InstructorRowEdit({
  instructor,
  instructors,
  setInstructors,
  courseOptions,
  roles,
  setEditActive,
  courses,
}) {
  const [addCourse, setAddCourse] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState(
    instructor ? [...instructor.courses] : []
  );

  const formSchema = yup.object().shape({
    first_name: yup.string().required(),
    last_name: yup.string().required(),
    roles: yup.array().of(yup.number()),
    email_address: yup.string().email().required(),
    courses: yup.array().of(yup.object()),
  });

  const formik = useFormik({
    initialValues: {
      first_name: instructor ? instructor.first_name : "",
      last_name: instructor ? instructor.last_name : "",
      roles: instructor ? instructor.roles.map((role) => role.id) : [],
      email_address: instructor ? instructor.email_address : "",
      courses: instructor ? instructor.courses : [],
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      if (instructor) {
        const body = {
          id: instructor.id,
          first_name: values.first_name,
          last_name: values.last_name,
          roles: values.roles,
          email_address: values.email_address,
          courses: values.courses.map((course) => course.id),
        };
        fetch(`/api/users/${instructor.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then((data) => {
            setInstructors(
              instructors.map((i) => (i.id === instructor.id ? data : i))
            );
            formik.resetForm();
            setAddCourse(null);
            setInstructorCourses([...instructor.courses]);
            setEditActive(false);
            alert("Instructor updated successfully!");
          });
      } else {
        const body = {
          first_name: values.first_name,
          last_name: values.last_name,
          email_address: values.email_address,
          password: values.email_address,
        };
        if (values.roles.length > 0) {
          body.roles = values.roles;
        }
        if (values.courses.length > 0) {
          body.courses = values.courses.map((course) => course.id);
        }
        fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((r) => r.json())
          .then((data) => {
            setInstructors([...instructors, data]);
            formik.resetForm();
            setAddCourse(null);
            setInstructorCourses([]);
            setEditActive(false);
            alert("Instructor created successfully!");
          });
      }
    },
  });

  const currCourses =
    instructorCourses.length > 0
      ? instructorCourses.map((course) => {
          if (course !== null) {
            return (
              <List.Item
                key={
                  instructor
                    ? `${instructor.id}-${course.id}`
                    : `new-instructor-${course.id}`
                }
              >
                <Button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue(
                      "courses",
                      formik.values.courses.filter((e) => e.id !== course.id)
                    );
                    setInstructorCourses(
                      instructorCourses.filter((e) => e.id !== course.id)
                    );
                  }}
                  color="red"
                  icon
                >
                  <Icon name="remove circle" />
                </Button>
                {course.name}
              </List.Item>
            );
          } else {
            return null;
          }
        })
      : [];

  const rolesCheckboxes = roles.map((role) => {
    return (
      <Checkbox
        key={role.id}
        label={role.name}
        checked={formik.values.roles.includes(role.id)}
        onChange={(e, { checked }) => {
          if (checked) {
            formik.setFieldValue("roles", formik.values.roles.concat(role.id));
          } else {
            formik.setFieldValue(
              "roles",
              formik.values.roles.filter((r) => r !== role.id)
            );
          }
        }}
      />
    );
  });

  return (
    <TableRow key={instructor ? instructor.id : "new-instructor"}>
      <TableCell>
        <Input
          name="first_name"
          type="text"
          placeholder="First Name"
          onChange={formik.handleChange}
          value={formik.values.first_name}
        />
      </TableCell>
      <TableCell>
        <Input
          name="last_name"
          type="text"
          placeholder="Last Name"
          onChange={formik.handleChange}
          value={formik.values.last_name}
        />
      </TableCell>
      <TableCell>{rolesCheckboxes}</TableCell>
      <TableCell>
        <Input
          name="email_address"
          type="text"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email_address}
        />
      </TableCell>
      <TableCell>
        <Dropdown
          search
          name="courses-dropdown"
          placeholder="Select a Course"
          options={courseOptions.filter(
            (course) =>
              !instructorCourses.find((iCourse) => iCourse.id === course.value)
          )}
          value={addCourse}
          onChange={(e, { value }) => {
            setAddCourse(value);
          }}
        />{" "}
        <Button
          type="button"
          color="blue"
          onClick={() => {
            const newCourse = courses.find((c) => c.id === addCourse);
            formik.setFieldValue("courses", [
              ...formik.values.courses,
              newCourse,
            ]);
            setInstructorCourses([...instructorCourses, newCourse]);
            setAddCourse(null);
          }}
        >
          Add Course
        </Button>
        <List>{currCourses}</List>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          onClick={() => {
            formik.resetForm();
            setAddCourse(null);
            setInstructorCourses([...instructor.courses]);
            setEditActive(false);
          }}
        >
          Cancel
        </Button>
        <Button color="green" type="submit" onClick={formik.handleSubmit}>
          {instructor ? "Save" : "Create Instructor"}
        </Button>
        <DeleteInstructorButton
          {...{ instructor, instructors, setInstructors }}
        />
      </TableCell>
    </TableRow>
  );
}

export default InstructorRowEdit;

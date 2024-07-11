import { useState, useEffect } from "react";
import {
  Header,
  Label,
  Dropdown,
  Button,
  Grid,
  GridRow,
  Input,
  List,
  Icon,
  Form,
  Confirm,
  GridColumn,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useOutletContext, useNavigate } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [currCourse, setCurrCourse] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [levels, setLevels] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [deleteActive, setDeleteActive] = useState(false);

  const { user } = useOutletContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    fetch("/api/disciplines")
      .then((r) => r.json())
      .then((data) => {
        setDisciplines(data);
      });
    fetch("/api/levels")
      .then((r) => r.json())
      .then((data) => {
        setLevels(data);
      });
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setInstructors(
          data.filter((user) => user.roles.find((r) => r.name === "Instructor"))
        );
      });
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    discipline_id: yup.number().required(),
    level_id: yup.number().required(),
    user_ids: yup.array().of(yup.number()),
    student_ids: yup.array().of(yup.number()),
    selectedCourse: yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      id: currCourse ? currCourse.id : "",
      name: currCourse ? currCourse.name : "",
      discipline_id: currCourse ? currCourse.discipline.id : "",
      level_id: currCourse ? currCourse.level.id : "",
      user_ids: currCourse ? currCourse.users.map((user) => user.id) : [],
      student_ids: currCourse
        ? currCourse.students.map((student) => student.id)
        : [],
      selectedCourse: null,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (values.id === 0) {
        fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => {
            setCourses([...courses, data]);
            setCurrCourse(data);
            alert("Course created successfully!");
            return data;
          })
          .then((data) => {
            formik.setValues({
              id: data.id,
              name: data.name,
              discipline_id: data.discipline.id,
              level_id: data.level.id,
              user_ids: data.users.map((user) => user.id),
              student_ids: data.students.map((student) => student.id),
              selectedCourse: courseOptions.length,
            });
          });
      } else {
        fetch(`/api/courses/${values.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((response) => response.json())
          .then((data) => {
            setCourses(
              courses.map((course) => (course.id === data.id ? data : course))
            );
          });
      }
    },
  });

  const courseOptions = [
    {
      key: 0,
      text: "Create a new course",
      value: 0,
    },
    ...courses.map((course) => {
      return {
        key: course.id,
        text: course.name,
        value: course.id,
      };
    }),
  ];

  const instructorsList = instructors
    .filter((instructor) => formik.values.user_ids.includes(instructor.id))
    .map((instructor) => {
      return (
        <List.Item key={instructor.id}>
          <Button
            circular
            size="mini"
            type="button"
            color="red"
            onClick={() => {
              formik.setFieldValue(
                "user_ids",
                formik.values.user_ids.filter((id) => id !== instructor.id)
              );
            }}
          >
            <Icon name="remove" />
          </Button>
          {instructor.first_name} {instructor.last_name}
        </List.Item>
      );
    });

  const studentsList = students
    .filter((student) => formik.values.student_ids.includes(student.id))
    .map((student) => {
      return (
        <List.Item key={student.id}>
          <Button
            circular
            size="mini"
            type="button"
            color="red"
            onClick={() => {
              formik.setFieldValue(
                "student_ids",
                formik.values.students.filter((id) => id !== student.id)
              );
            }}
          >
            <Icon name="remove" />
          </Button>
          {student.first_name} {student.last_name}
        </List.Item>
      );
    });

  function handleDelete() {
    fetch(`/api/courses/${formik.values.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(courses.filter((course) => course.id !== formik.values.id));
        setDeleteActive(false);
        formik.resetForm();
        setCurrCourse(null);
        alert("Course deleted successfully!");
      });
  }

  const editCourseForm = (
    <Form onSubmit={formik.handleSubmit}>
      <Grid columns="equal" divided centered widths="equal">
        <GridRow>
          <Form.Field required>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Field>
        </GridRow>
        <GridRow>
          <Form.Field required={true}>
            <Label>Discipline</Label>
            <Dropdown
              search
              name="discipline-dropdown"
              placeholder="Select a Discipline"
              options={
                disciplines
                  ? disciplines.map((discipline) => {
                      return {
                        key: discipline.id,
                        text: discipline.name,
                        value: discipline.id,
                      };
                    })
                  : []
              }
              value={formik.values.discipline_id}
              onChange={(e, { value }) => {
                formik.setFieldValue("discipline_id", value);
              }}
            />
          </Form.Field>
          <Form.Field required={true}>
            <Label>Level</Label>
            <Dropdown
              search
              name="level-dropdown"
              placeholder="Select a Level"
              options={
                levels
                  ? levels.map((level) => {
                      return {
                        key: level.id,
                        text: level.name,
                        value: level.id,
                      };
                    })
                  : []
              }
              value={formik.values.level_id}
              onChange={(e, { value }) => {
                formik.setFieldValue("level_id", value);
              }}
            />
          </Form.Field>
        </GridRow>
        <GridRow columns={2} centered>
          <GridColumn>
            <Form.Field>
              <Label>Instructors</Label>
              <Dropdown
                search
                name="instructors-dropdown"
                placeholder="Select an Instructor"
                options={
                  instructors
                    ? instructors
                        .filter(
                          (instructor) =>
                            !formik.values.user_ids.includes(instructor.id)
                        )
                        .map((instructor) => {
                          return {
                            key: instructor.id,
                            text:
                              instructor.first_name +
                              " " +
                              instructor.last_name,
                            value: instructor.id,
                          };
                        })
                    : []
                }
                value={selectedInstructor}
                onChange={(e, { value }) => {
                  setSelectedInstructor(value);
                }}
              />
              <Button
                type="button"
                size="mini"
                color="blue"
                onClick={() => {
                  formik.setFieldValue("user_ids", [
                    ...formik.values.user_ids,
                    selectedInstructor,
                  ]);
                }}
              >
                Add Instructor
              </Button>
              <List>{instructorsList}</List>
            </Form.Field>
          </GridColumn>
          <GridColumn>
            <Form.Field>
              <Label>Students</Label>
              <Dropdown
                search
                name="students-dropdown"
                placeholder="Select a Student"
                options={
                  students
                    ? students
                        .filter(
                          (student) =>
                            !formik.values.student_ids.includes(student.id)
                        )
                        .map((student) => {
                          return {
                            key: student.id,
                            text: student.first_name + " " + student.last_name,
                            value: student.id,
                          };
                        })
                    : []
                }
                value={selectedStudent}
                onChange={(e, { value }) => {
                  setSelectedStudent(value);
                }}
              />
              <Button
                type="button"
                size="mini"
                color="blue"
                onClick={() => {
                  formik.setFieldValue("student_ids", [
                    ...formik.values.student_ids,
                    selectedStudent,
                  ]);
                }}
              >
                Add Student
              </Button>
              <List>{studentsList}</List>
            </Form.Field>
          </GridColumn>
        </GridRow>
        <Button type="submit" color="green">
          {formik.values.id === 0 ? "Create Course" : "Save Changes"}
        </Button>
        <GridRow>
          <Button
            type="button"
            color="red"
            onClick={() => {
              setDeleteActive(true);
            }}
          >
            Delete Course
          </Button>
          <Confirm
            open={deleteActive}
            onCancel={() => setDeleteActive(false)}
            onConfirm={handleDelete}
            header="Delete Course"
            content="Are you sure you want to delete this course?"
            confirmButton="Delete"
            cancelButton="Cancel"
          />
        </GridRow>
      </Grid>
    </Form>
  );

  return (
    <>
      <Header as="h1">Courses</Header>
      <Grid centered>
        <GridRow>
          <Dropdown
            search
            name="course-dropdown"
            placeholder="Select a Course"
            options={courseOptions}
            value={formik.values.selectedCourse}
            onChange={(e, { value }) => {
              const newCourse = courses.find((c) => c.id === value);
              setCurrCourse(newCourse);
              if (newCourse) {
                formik.setValues({
                  id: newCourse ? newCourse.id : "",
                  name: newCourse ? newCourse.name : "",
                  discipline_id: newCourse ? newCourse.discipline.id : "",
                  level_id: newCourse ? newCourse.level.id : "",
                  user_ids: newCourse
                    ? newCourse.users.map((user) => user.id)
                    : [],
                  student_ids: newCourse
                    ? newCourse.students.map((student) => student.id)
                    : [],
                  selectedCourse: value,
                });
              } else {
                formik.setValues({
                  id: 0,
                  name: "",
                  discipline_id: "",
                  level_id: "",
                  user_ids: [],
                  student_ids: [],
                  selectedCourse: value,
                });
              }
            }}
          />
          <Button color="grey" type="button" onClick={() => formik.resetForm()}>
            Clear Form
          </Button>
        </GridRow>
        {editCourseForm}
      </Grid>
    </>
  );
}

export default Courses;

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

/**
 * Component for managing courses.
 * @returns {JSX.Element} The rendered component.
 */
function Courses() {
  // State for storing courses
  const [courses, setCourses] = useState([]);
  // State for storing the current course
  const [currCourse, setCurrCourse] = useState(null);
  // State for storing disciplines
  const [disciplines, setDisciplines] = useState([]);
  // State for storing levels
  const [levels, setLevels] = useState([]);
  // State for storing instructors
  const [instructors, setInstructors] = useState([]);
  // State for storing students
  const [students, setStudents] = useState([]);
  // State for toggling the delete course confirmation modal
  const [deleteActive, setDeleteActive] = useState(false);

  // Get the user from the outlet context
  const { user } = useOutletContext();

  // Get the navigate function from the router
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!user.email_address) {
      navigate("/login");
    }
    // Redirect to reports if user is not an admin
    else if (!user.roles.map((r) => r.name).includes("Admin")) {
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    // Fetch courses
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    // Fetch disciplines
    fetch("/api/disciplines")
      .then((r) => r.json())
      .then((data) => {
        setDisciplines(data);
      });
    // Fetch levels
    fetch("/api/levels")
      .then((r) => r.json())
      .then((data) => {
        setLevels(data);
      });
    // Fetch instructors
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setInstructors(
          data.filter((user) => user.roles.find((r) => r.name === "Instructor"))
        );
      });
    // Fetch students
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  // State for storing the selected instructor
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  // State for storing the selected student
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form validation schema
  const schema = yup.object().shape({
    id: yup.number().required(),
    name: yup.string().required(),
    discipline_id: yup.number().required(),
    level_id: yup.number().required(),
    user_ids: yup.array().of(yup.number()),
    student_ids: yup.array().of(yup.number()),
    selectedCourse: yup.number(),
  });

  // Formik hook for handling form submission and validation
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
      // If the course is new, create it
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

  // Generate options for the course dropdown menu
  const courseOptions = [
    {
      key: 0,
      text: "Create a new course",
      value: 0,
    },
    // Map each course to an object with the necessary properties
    ...courses.map((course) => {
      return {
        key: course.id,
        text: course.name,
        value: course.id,
      };
    }),
  ];

  // Generate a list of instructors for the current course
  const instructorsList = instructors
    // Filter the instructors based on the user_ids field in formik.values
    .filter((instructor) => formik.values.user_ids.includes(instructor.id))
    // Map each instructor to a List.Item component
    .map((instructor) => {
      return (
        <List.Item key={instructor.id}>
          {/* Button to remove the instructor from the list */}
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
          {/* Display the instructor's name */}
          {instructor.first_name} {instructor.last_name}
        </List.Item>
      );
    });

  // Generate a list of students for the current course
  const studentsList = students
    // Filter the students based on the student_ids field in formik.values
    .filter((student) => formik.values.student_ids.includes(student.id))
    // Map each student to a List.Item component
    .map((student) => {
      return (
        <List.Item key={student.id}>
          {/* Button to remove the student from the list */}
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
          {/* Display the student's name */}
          {student.first_name} {student.last_name}
        </List.Item>
      );
    });

  /**
   * Displays an alert indicating the success of the deletion.
   */
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

  // Form to edit a course
  const editCourseForm = (
    <Form onSubmit={formik.handleSubmit}>
      {/* Grid layout for form fields */}
      <Grid columns="equal" divided centered widths="equal">
        <GridRow>
          {/* Name field */}
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
          {/* Discipline field */}
          <Form.Field required={true}>
            <Label>Discipline</Label>
            {/* Dropdown for selecting a discipline */}
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
          {/* Level field */}
          <Form.Field required={true}>
            <Label>Level</Label>
            {/* Dropdown for selecting a level */}
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
          {/* Instructors section */}
          <GridColumn>
            <Form.Field>
              <Label>Instructors</Label>
              {/* Dropdown for selecting an instructor */}
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
              {/* Button to add an instructor */}
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
              {/* List of added instructors */}
              <List>{instructorsList}</List>
            </Form.Field>
          </GridColumn>
          {/* Students section */}
          <GridColumn>
            <Form.Field>
              <Label>Students</Label>
              {/* Dropdown for selecting a student */}
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
              {/* Button to add a student */}
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
              {/* List of added students */}
              <List>{studentsList}</List>
            </Form.Field>
          </GridColumn>
        </GridRow>
        {/* Button to submit the form */}
        <Button type="submit" color="green">
          {formik.values.id === 0 ? "Create Course" : "Save Changes"}
        </Button>
        <GridRow>
          {/* Button to delete the course */}
          <Button
            type="button"
            color="red"
            onClick={() => {
              setDeleteActive(true);
            }}
          >
            Delete Course
          </Button>
          {/* Confirmation modal for deleting the course */}
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
      {/* Header for the page */}
      <Header as="h1">Courses</Header>
      {/* Grid for the page */}
      <Grid centered>
        {/* Row for the course dropdown and clear form button */}
        <GridRow>
          {/* Dropdown to select a course */}
          <Dropdown
            search
            name="course-dropdown"
            placeholder="Select a Course"
            options={courseOptions}
            value={formik.values.selectedCourse}
            onChange={(e, { value }) => {
              // Find the new course based on the selected value
              const newCourse = courses.find((c) => c.id === value);
              // Set the current course to the new course
              setCurrCourse(newCourse);
              // If the new course exists, set the form values to the new course's values
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
                // If the new course doesn't exist, reset the form values
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
          {/* Button to clear the form */}
          <Button color="grey" type="button" onClick={() => formik.resetForm()}>
            Clear Form
          </Button>
        </GridRow>
        {/* Display the edit course form */}
        {editCourseForm}
      </Grid>
    </>
  );
}

export default Courses;

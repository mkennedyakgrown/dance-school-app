import { useState } from "react";
import {
  Form,
  FormField,
  Label,
  Input,
  Dropdown,
  Button,
  Icon,
  List,
  Grid,
  GridRow,
} from "semantic-ui-react";
import DeleteStudentButton from "./DeleteStudentButton";

function EditStudentForm({
  formik = {
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
  courses = [],
  genders = [],
  students = [],
  setStudents,
}) {
  const [currCourse, setCurrCourse] = useState(null);
  const [currPlacementCourse, setCurrPlacementCourse] = useState(null);

  const genderOptions =
    genders.length > 0
      ? [
          { key: 0, text: "Prefer not to say", value: 0 },
          ...genders.map((gender) => {
            return {
              key: gender.id,
              text: gender.name,
              value: gender.id,
            };
          }),
        ]
      : [];
  const courseOptions =
    courses.length > 0
      ? courses.map((course) => {
          return {
            key: course.id,
            text: course.name,
            value: course.id,
          };
        })
      : [];
  function handleAddCourse() {
    if (!formik.values.courses.includes(currCourse)) {
      formik.setFieldValue("courses", [...formik.values.courses, currCourse]);
    }
    setCurrCourse(null);
  }
  function handleAddPlacement() {
    if (!formik.values.placements.includes(currPlacementCourse)) {
      formik.setFieldValue("placements", [
        ...formik.values.placements,
        { id: 0, course_id: currPlacementCourse, student_id: formik.values.id },
      ]);
    }
    setCurrPlacementCourse(null);
  }
  return (
    <>
      <Form>
        <Grid columns={2} divided>
          <GridRow centered>
            <FormField>
              <Label>First Name</Label>
              <Input
                type="text"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
              />
            </FormField>
            <FormField>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
              />
            </FormField>
          </GridRow>
          <GridRow centered>
            <FormField>
              <Label>Email Address</Label>
              <Input
                type="text"
                name="email_address"
                value={formik.values.email_address}
                onChange={formik.handleChange}
              />
            </FormField>
            <FormField>
              <Label>Secondary Email Address</Label>
              <Input
                type="text"
                name="secondary_email_address"
                value={formik.values.secondary_email_address}
                onChange={formik.handleChange}
              />
            </FormField>
          </GridRow>
          <GridRow centered>
            <FormField>
              <Label>Birth Date</Label>
              <Input
                type="date"
                name="birth_date"
                value={formik.values.birth_date}
                onChange={formik.handleChange}
              />
            </FormField>
            <FormField>
              <Label>Gender</Label>
              <Dropdown
                placeholder="Select Gender"
                search
                selection
                clearable
                options={genderOptions}
                onChange={(e, { value }) => {
                  formik.setFieldValue("gender_id", value);
                }}
              />
            </FormField>
          </GridRow>
          <GridRow centered>
            <FormField>
              <Label>Courses</Label>
              <Dropdown
                placeholder="Select Course"
                search
                selection
                clearable
                options={courseOptions}
                value={currCourse}
                onChange={(e, { value }) => {
                  setCurrCourse(value);
                }}
              />
              <Button color="blue" type="button" onClick={handleAddCourse}>
                Add Course
              </Button>
              <List>
                {formik.values.courses.length > 0
                  ? formik.values.courses.map((courseId) => (
                      <List.Item key={`course-${courseId}`}>
                        <Button
                          circular
                          size="mini"
                          type="button"
                          color="red"
                          onClick={() => {
                            formik.setFieldValue(
                              "courses",
                              formik.values.courses.filter(
                                (cId) => cId !== courseId
                              )
                            );
                          }}
                        >
                          <Icon name="remove" />
                        </Button>
                        {courses.find((c) => c.id === courseId).name}
                      </List.Item>
                    ))
                  : null}
              </List>
            </FormField>
            <FormField>
              <Label>Placements</Label>
              <Dropdown
                placeholder="Select Course"
                search
                selection
                clearable
                options={courseOptions}
                value={currPlacementCourse}
                onChange={(e, { value }) => {
                  setCurrPlacementCourse(value);
                }}
              />
              <Button color="blue" type="button" onClick={handleAddPlacement}>
                Add Placement
              </Button>
              <List>
                {formik.values.placements.length > 0
                  ? formik.values.placements.map((placement) => (
                      <List.Item key={`placement-${placement.course_id}`}>
                        <Button
                          circular
                          size="mini"
                          type="button"
                          color="red"
                          onClick={() => {
                            formik.setFieldValue(
                              "placements",
                              formik.values.placements.filter(
                                (p) => p.id !== placement.id
                              )
                            );
                            formik.setFieldValue("delete_placements", [
                              ...formik.values.delete_placements,
                              placement.id,
                            ]);
                          }}
                        >
                          <Icon name="remove" />
                        </Button>
                        {courses.find((c) => c.id === placement.course_id).name}
                      </List.Item>
                    ))
                  : null}
              </List>
            </FormField>
          </GridRow>
          <GridRow centered>
            <FormField>
              <Button color="green" type="submit" onClick={formik.handleSubmit}>
                Save Changes
              </Button>
            </FormField>
          </GridRow>
          <GridRow centered>
            {formik.values.id > 0 && (
              <DeleteStudentButton
                {...{
                  studentId: formik.values.id,
                  students,
                  setStudents,
                  formik,
                }}
              />
            )}
          </GridRow>
        </Grid>
      </Form>
    </>
  );
}

export default EditStudentForm;

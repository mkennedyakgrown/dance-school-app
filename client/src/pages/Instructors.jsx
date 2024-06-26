import { useState, useEffect } from "react";
import {
  Header,
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableBody,
} from "semantic-ui-react";
import InstructorRow from "../components/InstructorRow";
import InstructorRowEdit from "../components/InstructorRowEdit";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setInstructors(data);
      });
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
      });
    fetch("/api/roles")
      .then((r) => r.json())
      .then((data) => {
        setRoles(data);
      });
  }, []);

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

  const rolesOptions =
    roles.length > 0
      ? roles.map((role) => {
          return {
            key: role.id,
            text: role.name,
            value: role.id,
          };
        })
      : [];

  const instructorRows =
    instructors.length > 0
      ? instructors.map((instructor) => {
          return (
            <InstructorRow
              key={instructor.id}
              {...{
                instructor,
                instructors,
                setInstructors,
                courseOptions,
                roles,
                courses,
              }}
            />
          );
        })
      : [];

  return (
    <>
      <Header as="h1">Instructors</Header>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>First Name</TableHeaderCell>
            <TableHeaderCell>Last Name</TableHeaderCell>
            <TableHeaderCell>Roles</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Courses</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InstructorRowEdit
            key={"new-instructor-row"}
            {...{
              instructors,
              setInstructors,
              courseOptions,
              roles,
              courses,
            }}
          />
          {instructorRows}
        </TableBody>
      </Table>
    </>
  );
}

export default Instructors;

import { useState, useEffect } from "react";
import {
  Header,
  Button,
  Table,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableBody,
  Icon,
} from "semantic-ui-react";
import InstructorRow from "../components/InstructorRow";
import InstructorRowNew from "../components/InstructorRowNew";

function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sortSelection, setSortSelection] = useState("");

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

  function sortInstructorsByFirstName() {
    const sortedInstructors = [...instructors];
    sortedInstructors.sort((a, b) => {
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name > b.first_name) {
        return 1;
      }
      return 0;
    });
    setInstructors(sortedInstructors);
    setSortSelection("first_name");
  }

  function sortInstructorsByLastName() {
    const sortedInstructors = [...instructors];
    sortedInstructors.sort((a, b) => {
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }
      return 0;
    });
    setInstructors(sortedInstructors);
    setSortSelection("last_name");
  }

  return (
    <>
      <Header as="h1">Instructors</Header>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell onClick={() => sortInstructorsByFirstName()}>
              First Name
              {sortSelection === "first_name" ? (
                <Icon name="carat arrow down" />
              ) : null}
            </TableHeaderCell>
            <TableHeaderCell onClick={() => sortInstructorsByLastName()}>
              Last Name
              {sortSelection === "last_name" ? (
                <Icon name="carat arrow down" />
              ) : null}
            </TableHeaderCell>
            <TableHeaderCell>Roles</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Courses</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <InstructorRowNew
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

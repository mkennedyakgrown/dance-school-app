import { useState, useEffect } from "react";
import { Button, Header, Input, Label, Table } from "semantic-ui-react";
import { useOutletContext } from "react-router-dom";
import ReportRow from "../components/ReportRow";

function ReportsInstructor({ user }) {
  const [courses, setCourses] = useState([]);
  const [coursesFilter, setCoursesFilter] = useState("");
  const [studentsFilter, setStudentsFilter] = useState("");
  const [coursesAreHidden, setCoursesAreHidden] = useState(false);
  const [studentsAreHidden, setStudentsAreHidden] = useState(false);

  useEffect(() => {
    fetch("api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      });
  }, []);

  const courseRows = user.courses
    ? user.courses
        .filter((course) =>
          course.name.toLowerCase().includes(coursesFilter.toLowerCase())
        )
        .map((course) => {
          console.log(course, user);
          console.log(
            user.course_reports.find((report) => report.course.id === course.id)
          );
          return (
            <ReportRow
              key={`${course.name}-${user.first_name}-${user.last_name}`}
              {...{
                label: `${course.name} - ${user.first_name} ${user.last_name}`,
                reportType: "course",
                currReport: user.course_reports.find(
                  (report) => report.course.id === course.id
                ),
                course_id: course.id,
                user_id: user.id,
              }}
            />
          );
        })
    : [];

  const studentRows = user.courses
    ? courses
        .filter((course) => user.courses.map((c) => c.id).includes(course.id))
        .map((course) =>
          course.students.map((student) => ({
            ...student,
            course_name: course.name,
            course_id: course.id,
          }))
        )
        .reduce((acc, curr) => acc.concat(curr), [])
        .filter((student) =>
          `${student.first_name} ${student.last_name}`.includes(studentsFilter)
        )
        .map((student) => (
          <ReportRow
            key={`${student.first_name}-${student.last_name}-${student.course_name}`}
            {...{
              label: `${student.first_name} ${student.last_name} - ${student.course_name}`,
              reportType: "student",
              currReport: {},
              course_id: student.course_id,
              student_id: student.id,
              user_id: user.id,
            }}
          />
        ))
    : [];

  return (
    <div>
      <Table textAlign="center" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Course Report</Table.HeaderCell>
            <Table.HeaderCell>
              <Label>Filter Courses</Label>
              <Input
                placeholder="Filter"
                value={coursesFilter}
                onChange={(e) => setCoursesFilter(e.target.value)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Button
                onClick={() => {
                  setCoursesAreHidden(!coursesAreHidden);
                }}
              >
                {coursesAreHidden ? "Show" : "Hide"}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body key="course-reports">
          {coursesAreHidden ? null : courseRows}
        </Table.Body>
      </Table>
      <Table textAlign="center" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Student Report</Table.HeaderCell>
            <Table.HeaderCell>
              <Label>Filter Students</Label>
              <Input
                placeholder="Filter"
                value={studentsFilter}
                onChange={(e) => setStudentsFilter(e.target.value)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Button
                onClick={() => {
                  setStudentsAreHidden(!studentsAreHidden);
                }}
              >
                {studentsAreHidden ? "Show" : "Hide"}
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body key="student-reports">
          {studentsAreHidden ? null : studentRows}
        </Table.Body>
      </Table>
    </div>
  );
}

export default ReportsInstructor;

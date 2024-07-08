import { useState, useEffect } from "react";
import { Button, Header, Input, Label, Table } from "semantic-ui-react";
import ReportRow from "../components/ReportRow";

function Reports() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [courseReports, setCourseReports] = useState([]);
  const [studentReports, setStudentReports] = useState([]);
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

    fetch("api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
      });

    fetch("api/course-reports")
      .then((res) => res.json())
      .then((data) => {
        setCourseReports(data);
      });

    fetch("api/student-reports")
      .then((res) => res.json())
      .then((data) => {
        setStudentReports(data);
      });
  }, []);

  const courseRows =
    courses.length > 0
      ? courses
          .filter((course) => course.name.includes(coursesFilter))
          .map((course) =>
            course.course_reports.map((report) => (
              <ReportRow
                {...{
                  label: `${course.name} - ${report.user.first_name} ${report.user.last_name}`,
                  reportType: "course",
                  report: {},
                  course_id: course.id,
                }}
              />
            ))
          )
      : [];

  const studentRows =
    students.length > 0
      ? students.map((student) => (
          <ReportRow
            {...{
              label: student.first_name + " " + student.last_name,
              reportType: "student",
              report: {},
              student_id: student.id,
            }}
          />
        ))
      : [];

  return (
    <div>
      <Header as="h1" textAlign="center">
        Reports
      </Header>
      <Table fluid textAlign="center" celled>
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
        <Table.Body>{coursesAreHidden ? null : courseRows}</Table.Body>
      </Table>
      <Table fluid textAlign="center" celled>
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
        <Table.Body>{studentsAreHidden ? null : studentRows}</Table.Body>
      </Table>
    </div>
  );
}

export default Reports;

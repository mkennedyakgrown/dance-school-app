import { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  Header,
  Input,
  Label,
  Table,
} from "semantic-ui-react";
import ReportRow from "../components/ReportRow";

function ReportsAdmin() {
  const [courses, setCourses] = useState([]);
  const [studentsFilter, setStudentsFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetch("api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      });
  }, []);

  const courseOptions =
    courses.length > 0
      ? courses.map((course) => ({
          key: course.id,
          text: course.name,
          value: course.id,
        }))
      : [];

  const courseRows = selectedCourse
    ? selectedCourse.users.map((user) => {
        return (
          <ReportRow
            key={`${user.first_name}-${user.last_name}-${selectedCourse.name}`}
            {...{
              label: `${user.first_name} ${user.last_name} - ${selectedCourse.name}`,
              reportType: "course",
              currReport: selectedCourse.course_reports
                ? selectedCourse.course_reports.find(
                    (report) => report.user.id === user.id
                  )
                : null,
              course_id: selectedCourse.id,
              user_id: user.id,
            }}
          />
        );
      })
    : [];

  const studentRows = selectedCourse
    ? selectedCourse.students
        .filter((student) =>
          `${student.first_name} ${student.last_name}`
            .toLowerCase()
            .includes(studentsFilter.toLowerCase())
        )
        .map((student) => {
          console.log(student);
          const studentReport = selectedCourse.student_reports.find(
            (report) => report.student_id === student.id
          );
          if (studentReport) {
            return (
              <ReportRow
                key={`${student.first_name}-${student.last_name}-${selectedCourse.name}`}
                {...{
                  label: `${student.first_name} ${student.last_name} - ${selectedCourse.name}`,
                  reportType: "student",
                  currReport: studentReport,
                  user_id: studentReport.user.id,
                  course_id: selectedCourse.id,
                  student_id: student.id,
                }}
              />
            );
          } else {
            return (
              <ReportRow
                key={`${student.first_name}-${student.last_name}-${selectedCourse.name}`}
                {...{
                  label: `${student.first_name} ${student.last_name} - ${selectedCourse.name}`,
                  reportType: "student",
                  currReport: null,
                  user_id: selectedCourse.users[0].id,
                  course_id: selectedCourse.id,
                  student_id: student.id,
                }}
              />
            );
          }
        })
    : [];

  return (
    <div>
      <Dropdown
        placeholder="Select a course"
        search
        selection
        options={courseOptions}
        onChange={(e, data) => {
          setSelectedCourse(
            courses.filter((course) => course.id === data.value)[0]
          );
        }}
      />
      <Table textAlign="center" celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Course Report</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{courseRows}</Table.Body>
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
          </Table.Row>
        </Table.Header>
        <Table.Body>{studentRows}</Table.Body>
      </Table>
    </div>
  );
}

export default ReportsAdmin;

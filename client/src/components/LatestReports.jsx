import { useState, useEffect } from "react";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableFooter,
  TableCell,
  TableBody,
  Table,
} from "semantic-ui-react";

function LatestReports() {
  const [studentReports, setStudentReports] = useState([]);

  useEffect(() => {
    fetch(`/api/student-reports?offset=0&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setStudentReports(data);
      });
  }, []);

  console.log(studentReports);

  const latestReports =
    studentReports.length > 0
      ? studentReports.map((report) => {
          return (
            <TableRow key={report.id}>
              <TableCell>{`${report.user.first_name} ${report.user.last_name}`}</TableCell>
              <TableCell>{report.course.name}</TableCell>
              <TableCell>{`${report.student.first_name} ${report.student.last_name}`}</TableCell>
              <TableCell>{report.content.slice(0, 50)}</TableCell>
            </TableRow>
          );
        })
      : null;

  return (
    <Table celled>
      <TableHeader>
        <TableHeaderCell>Latest Reports</TableHeaderCell>
      </TableHeader>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>Instructor</TableHeaderCell>
          <TableHeaderCell>Course</TableHeaderCell>
          <TableHeaderCell>Student</TableHeaderCell>
          <TableHeaderCell>Report</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>{latestReports}</TableBody>
    </Table>
  );
}

export default LatestReports;

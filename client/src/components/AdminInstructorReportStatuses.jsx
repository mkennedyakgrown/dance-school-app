import { useState, useEffect } from "react";
import {
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "semantic-ui-react";

function InstructorReportStatuses() {
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetch("/api/instructors-statuses")
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setInstructors(data);
      });
  }, []);

  const instructorReportStatuses =
    instructors.length > 0
      ? instructors.map((instructor) => {
          const completedReports = 0;
          const remainingReports = 0;
          return (
            <TableRow key={instructor.id}>
              <TableCell>{instructor.name}</TableCell>
              <TableCell>{instructor.completed_reports}</TableCell>
              <TableCell>{instructor.pending_reports}</TableCell>
            </TableRow>
          );
        })
      : null;

  return (
    <Table celled striped>
      <TableHeader>
        <TableHeaderCell>Instructor Report Statuses</TableHeaderCell>
      </TableHeader>
      <TableHeader>
        <TableHeaderCell>Instructor</TableHeaderCell>
        <TableHeaderCell>Completed Reports</TableHeaderCell>
        <TableHeaderCell>Remaining Reports</TableHeaderCell>
      </TableHeader>
      <TableBody>{instructorReportStatuses}</TableBody>
    </Table>
  );
}

export default InstructorReportStatuses;

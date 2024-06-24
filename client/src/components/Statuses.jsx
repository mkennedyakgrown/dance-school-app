import { useState, useEffect } from "react";
import {
  Table,
  TableHeaderCell,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "semantic-ui-react";

function Statuses() {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    fetch("/api/statuses")
      .then((r) => r.json())
      .then((data) => {
        setStatuses(data);
      });
  }, []);

  return (
    <Table celled striped bordered>
      <TableHeader>
        <b>Statuses</b>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableHeaderCell>Reports Approved / All</TableHeaderCell>
          <TableHeaderCell>Placements Entered</TableHeaderCell>
          <TableHeaderCell>Emails Created</TableHeaderCell>
        </TableRow>
        <TableRow>
          <TableCell>{`${statuses.reportsApproved} / ${statuses.reportsPending}`}</TableCell>
          <TableCell>{`${statuses.placementsApproved} / ${statuses.placementsPending}`}</TableCell>
          <TableCell>{`${statuses.emailsApproved} / ${statuses.emailsPending}`}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default Statuses;

import { Grid, GridRow, GridColumn, Segment } from "semantic-ui-react";

import LatestReports from "../components/AdminLatestReports.jsx";
import Statuses from "../components/AdminStatuses.jsx";
import AdminInstructorReportStatuses from "../components/AdminInstructorReportStatuses.jsx";

function Admin() {
  return (
    <Grid columns={2} divided>
      <GridRow>
        <h1>Admin</h1>
      </GridRow>
      <GridRow stretched>
        <GridColumn>
          <Segment>
            <LatestReports />
          </Segment>
          <Segment>
            <Statuses />
          </Segment>
        </GridColumn>
        <GridColumn stretched>
          <Segment>
            <AdminInstructorReportStatuses />
          </Segment>
        </GridColumn>
      </GridRow>
    </Grid>
  );
}

export default Admin;

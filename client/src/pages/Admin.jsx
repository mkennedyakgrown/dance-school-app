import { Grid, GridRow, GridColumn, Segment } from "semantic-ui-react";

import LatestReports from "../components/LatestReports.jsx";
import Statuses from "../components/Statuses.jsx";
import InstructorReportStatuses from "../components/InstructorReportStatuses.jsx";

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
            <InstructorReportStatuses />
          </Segment>
        </GridColumn>
      </GridRow>
    </Grid>
  );
}

export default Admin;

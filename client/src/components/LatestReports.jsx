import { useState, useEffect } from "react";
import { Grid, GridRow, GridColumn, Segment } from "semantic-ui-react";

function LatestReports() {
  const [studentReports, setStudentReports] = useState([]);

  useEffect(() => {
    fetch(`/api/student-reports?offset=0&limit=20`)
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
            <GridRow key={report.id}>
              <GridColumn>
                <Segment>{`${report.user.first_name} ${report.user.last_name}`}</Segment>
              </GridColumn>
              <GridColumn>
                <Segment>{report.course.name}</Segment>
              </GridColumn>
              <GridColumn>
                <Segment>{`${report.student.first_name} ${report.student.last_name}`}</Segment>
              </GridColumn>
              <GridColumn>
                <Segment>{report.content.slice(0, 50)}</Segment>
              </GridColumn>
            </GridRow>
          );
        })
      : null;

  return (
    <Grid columns={4} divided>
      <GridRow>
        <GridColumn>
          <Segment>
            <b>Latest Reports</b>
          </Segment>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn>
          <Segment>
            <b>Instructor</b>
          </Segment>
        </GridColumn>
        <GridColumn>
          <Segment>
            <b>Course</b>
          </Segment>
        </GridColumn>
        <GridColumn>
          <Segment>
            <b>Student</b>
          </Segment>
        </GridColumn>
        <GridColumn>
          <Segment>
            <b>Text</b>
          </Segment>
        </GridColumn>
      </GridRow>
      {latestReports}
    </Grid>
  );
}

export default LatestReports;

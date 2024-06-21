import LatestReports from "../components/LatestReports.jsx";
import Statuses from "../components/Statuses.jsx";
import InstructorReportStatuses from "../components/InstructorReportStatuses.jsx";

function Admin() {
  return (
    <>
      <h1>Admin</h1>
      <LatestReports />
      <Statuses />
      <InstructorReportStatuses />
    </>
  );
}

export default Admin;

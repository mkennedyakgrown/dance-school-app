import { Button } from "semantic-ui-react";
import { $generateHtmlFromNodes } from "@lexical/html";
import ReportTextEditor from "../components/ReportTextEditor";

function Reports() {
  return (
    <div>
      <h1>Reports</h1>
      <ReportTextEditor />
    </div>
  );
}

export default Reports;

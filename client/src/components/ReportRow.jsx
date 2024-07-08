import { useEffect, useState } from "react";
import ReportTextEditor from "./ReportTextEditor";
import { useFormik } from "formik";
import { Button, TableCell, TableRow } from "semantic-ui-react";
import * as yup from "yup";

function ReportRow({
  label,
  reportType,
  currReport,
  course_id,
  student_id,
  user_id,
}) {
  const [report, setReport] = useState(currReport);
  const [isActive, setIsActive] = useState(false);
  const formSchema = yup.object().shape({
    user_id: yup.number().required(),
    course_id: yup.number().required(),
    student_id: yup.number().nullable(),
    content: yup.string(),
    content_json: yup.string(),
    approved: yup.boolean().nullable(),
  });

  useEffect(() => {
    setReport(currReport);
  }, [currReport]);

  const formik = useFormik({
    initialValues: {
      user_id: user_id,
      course_id: course_id || null,
      student_id: student_id || null,
      content: report ? report.content : "",
      content_json: report ? report.content_json : "",
      approved: report ? report.approved : null,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      if (reportType === "course" && !report) {
        console.log("POSTING new course report");
        fetch("api/course-reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_id: values.course_id,
            content: values.content,
            content_json: values.content_json,
            user_id: values.user_id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setReport(data);
          });
      } else if (reportType === "course" && report) {
        console.log("PATCHING course report");
        fetch(`api/course-reports/${report.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: values.content,
            content_json: values.content_json,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setReport(data);
          });
      } else if (reportType === "student" && !report) {
        console.log("POSTING new student report", values);
        fetch("api/student-reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: values.student_id,
            user_id: values.user_id,
            course_id: values.course_id,
            content: values.content,
            content_json: values.content_json,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setReport(data);
          });
      } else if (reportType === "student" && report) {
        console.log("PATCHING student report");
        fetch(`api/student-reports/${report.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: values.content,
            content_json: values.content_json,
            approved: values.approved,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setReport(data);
          });
      }
    },
  });

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>
        {isActive ? (
          <ReportTextEditor {...{ formik, report }} />
        ) : (
          <iframe
            src={`data:text/html,${
              report ? report.content : "No report written yet."
            }`}
            height={50}
            frameBorder={0}
          />
        )}
      </TableCell>
      <TableCell>
        <Button
          onClick={() => {
            setIsActive(!isActive);
          }}
        >
          {isActive ? "Close" : "Edit"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default ReportRow;

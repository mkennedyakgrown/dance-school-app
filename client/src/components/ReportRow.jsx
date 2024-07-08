import { useState } from "react";
import ReportTextEditor from "./ReportTextEditor";
import { useFormik } from "formik";
import { Button, TableCell, TableRow } from "semantic-ui-react";
import * as yup from "yup";

function ReportRow({ label, reportType, report, course_id, student_id }) {
  const [isActive, setIsActive] = useState(false);
  const formSchema = yup.object().shape({
    course_id: yup.number(),
    student_id: yup.number().nullable(),
    content: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      course_id: course_id || null,
      student_id: student_id || null,
      content: report ? report.content : "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  console.log(formik);

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>
        {isActive ? (
          <ReportTextEditor {...{ formik }} />
        ) : (
          <iframe
            src={`data:text/html,${report.content || "No report written yet."}`}
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
          {isActive ? "Cancel" : "Edit"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default ReportRow;

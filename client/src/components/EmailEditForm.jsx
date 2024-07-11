import { useState, useEffect } from "react";
import { Button, Form, Grid, GridColumn, GridRow } from "semantic-ui-react";
import EmailTextEditor from "./EmailTextEditor";

function EmailEditForm({
  formik,
  currStudent,
  popupIsOpen,
  students,
  setStudents,
}) {
  const placements = currStudent.placements
    ? currStudent.placements.map((placement) => {
        return {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text:
                placement.course.name !== ""
                  ? placement.course.name
                  : "No Course",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "center",
          indent: 0,
          type: "paragraph",
          version: 1,
          textFormat: 0,
        };
      })
    : [];
  //   const suggestions = formik.values.student.email.student_reports.map(
  //     (report) => {
  //       return {
  //         children: [
  //           {
  //             detail: 0,
  //             format: 2,
  //             mode: "normal",
  //             style: "",
  //             text: report.course.name,
  //             type: "text",
  //             version: 1,
  //           },
  //         ],
  //         direction: "ltr",
  //         format: "center",
  //         indent: 0,
  //         type: "paragraph",
  //         version: 1,
  //         textFormat: 2,
  //       };
  //     }
  //   );
  const reports = currStudent.student_reports
    ? currStudent.student_reports
        .map((report) => {
          const paragraphSchema = {
            children: [
              {
                detail: 0,
                format: 1,
                mode: "normal",
                style: "",
                text: "",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "center",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 1,
          };
          const courseName = {
            ...paragraphSchema,
            children: [
              {
                ...paragraphSchema.children[0],
                text: report.course.name,
              },
            ],
          };
          const instructorSignature = {
            ...paragraphSchema,
            children: [
              {
                ...paragraphSchema.children[0],
                text: `${report.user.first_name} ${report.user.last_name}`,
              },
            ],
          };
          const courseReport = report.course.course_reports.find(
            (r) => r.user.id === report.user.id
          );
          const courseReportText = JSON.parse(courseReport.content_json).root
            .children[0];
          const reportText = JSON.parse(report.content_json).root.children;
          const emptyParagraph = {
            ...paragraphSchema,
            children: [{ ...paragraphSchema, children: [] }],
          };
          return [
            courseName,
            emptyParagraph,
            courseReportText,
            ...reportText,
            instructorSignature,
            emptyParagraph,
            emptyParagraph,
          ];
        })
        .reduce((acc, curr) => [...acc, ...curr], [])
    : [];

  const newEmailBody = JSON.stringify({
    root: {
      children: placements.length > 0 ? [...placements, ...reports] : [],
      direction: "ltr",
      format: "center",
      indent: 0,
      type: "root",
      version: 1,
    },
  });

  const emailBody = currStudent.email
    ? currStudent.email.length > 0
      ? currStudent.email[0].content_json
      : newEmailBody
    : newEmailBody;

  const approveButton = (
    <Button color="green" onClick={() => approveEmail(currStudent.email[0].id)}>
      Approve Email
    </Button>
  );

  function approveEmail(id) {
    fetch(`/api/emails/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        approved: true,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setStudents(
          students.map((student) => {
            if (student.id === data.student_id) {
              return {
                ...student,
                email: data,
              };
            } else {
              return student;
            }
          })
        );
      });
  }

  const textEditor =
    formik.values.selectedEmail === 0 ? null : (
      <EmailTextEditor {...{ formik, popupIsOpen, emailBody, approveButton }} />
    );

  return (
    <Form>
      <GridRow>
        <Form.Input
          id={"email_address"}
          autoComplete="email"
          label="Email Address"
          placeholder="Email Address"
          value={formik.values.email_address}
          onChange={formik.handleChange}
        />
        <Form.Input
          id={"secondary_email_address"}
          autoComplete="secondary_email_address"
          label="Secondary Email Address"
          placeholder="Secondary Email Address"
          value={formik.values.secondary_email_address}
          onChange={formik.handleChange}
        />
      </GridRow>
      <GridRow>
        {formik.values.selectedEmail === 0 ? null : approveButton}
      </GridRow>
      <GridRow>
        <GridColumn width={16}>{textEditor}</GridColumn>
      </GridRow>
    </Form>
  );
}

export default EmailEditForm;

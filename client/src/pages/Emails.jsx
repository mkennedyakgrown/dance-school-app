import { useState, useEffect } from "react";
import { Dropdown, Grid, GridColumn, GridRow, Header } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import EmailEditForm from "../components/EmailEditForm";

function Emails() {
  const [students, setStudents] = useState([]);
  const [currStudent, setCurrStudent] = useState({});

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  const formSchema = yup.object().shape({
    student: yup.object().nullable(),
    selectedEmail: yup.number(),
    id: yup.number(),
    student_id: yup.number().required(),
    email_address: yup.string().required(),
    secondary_email_address: yup.string(),
    content: yup.string().required(),
    content_json: yup.string().required(),
    date: yup.date().nullable(),
    approved: yup.boolean().required(),
  });

  const formik = useFormik({
    initialValues: {
      student: {},
      selectedEmail: 0,
      id: 0,
      student_id: 0,
      email_address: "",
      secondary_email_address: "",
      content: "",
      content_json: "",
      date: "",
      approved: false,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log("Submitted", values);
      if (currStudent.email.id === undefined) {
        fetch(`/api/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((r) => r.json())
          .then((data) => {
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
            setCurrStudent({ ...currStudent, email: data });
            formik.setFieldValue("id", data.id);
          });
      } else {
        fetch(`/api/emails/${values.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then((r) => r.json())
          .then((data) => {
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
    },
  });

  const notApprovedStudentItems = students
    .filter(
      (student) =>
        student.email.id === undefined || student.email.approved === false
    )
    .map((student) => {
      return {
        key: student.id,
        text: `${student.first_name} ${student.last_name}`,
        value: student.id,
      };
    });

  const approvedStudentItems = students
    .filter((student) => student.email.approved)
    .map((student) => {
      return {
        key: student.id,
        text: `${student.first_name} ${student.last_name}`,
        value: student.id,
      };
    });

  const editForm = <EmailEditForm {...{ formik, currStudent }} />;

  return (
    <>
      <Grid divided centered widths="equal">
        <GridRow>
          <Header as="h1">Emails</Header>
        </GridRow>
        <GridRow columns={2} style={{ minHeight: "350px" }}>
          <GridColumn>
            <Header as="h2">Not Approved Emails</Header>
            <Dropdown
              placeholder="Select a student"
              fluid
              search
              selection
              open={true}
              value={formik.values.selectedEmail}
              options={notApprovedStudentItems}
              onChange={(e, { value }) => {
                const student = students.find(
                  (student) => student.id === value
                );
                formik.setValues({
                  student: student,
                  selectedEmail: value,
                  id: student.email.id ? student.email.id : 0,
                  student_id: student.id,
                  email_address: student.email_address,
                  secondary_email_address: student.secondary_email_address,
                  content: student.email.content ? student.email.content : "",
                  content_json: student.email.content_json
                    ? student.email.content_json
                    : "",
                  date: student.email.date ? student.email.date : "",
                  approved: student.email.approved
                    ? student.email.approved
                    : false,
                });
                setCurrStudent(student);
              }}
            />
          </GridColumn>
          <GridColumn>
            <Header as="h2">Approved Emails</Header>
            <Dropdown
              placeholder="Select an email"
              fluid
              search
              selection
              open={true}
              options={approvedStudentItems}
              onChange={(e, { value }) => {
                console.log(value);
              }}
            />
          </GridColumn>
        </GridRow>
        {editForm}
      </Grid>
    </>
  );
}

export default Emails;

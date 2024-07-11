import { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  Grid,
  GridColumn,
  GridRow,
  Header,
  List,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import EmailEditForm from "../components/EmailEditForm";

function Emails() {
  const [students, setStudents] = useState([]);
  const [currStudent, setCurrStudent] = useState({});
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

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
      if (currStudent.email.length === 0) {
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
                    email: [data],
                  };
                } else {
                  return student;
                }
              })
            );
            setCurrStudent({ ...currStudent, email: [data] });
            formik.setFieldValue("id", data.id);
            handleOpenPopup();
            console.log(data);
          });
      } else {
        fetch(`/api/emails/${currStudent.email[0].id}`, {
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
                    email: [data],
                  };
                } else {
                  return student;
                }
              })
            );
            handleOpenPopup();
          });
      }
    },
  });

  function handleOpenPopup() {
    setPopupIsOpen(true);
    const timeout = setTimeout(() => {
      setPopupIsOpen(false);
    }, 2000);
  }

  const StudentItems = students.map((student) => {
    return {
      key: student.id,
      text: `${student.first_name} ${student.last_name}`,
      value: student.id,
    };
  });

  const approvedStudentItems = students
    .filter((student) =>
      student.email.length > 0 ? student.email[0].approved : false
    )
    .map((student) => (
      <List.Item
        key={student.id}
      >{`${student.first_name} ${student.last_name}`}</List.Item>
    ));

  const [editForm, setEditForm] = useState(null);

  if (isChanging) {
    setTimeout(() => {
      setIsChanging(false);
    }, 10);
  }

  return (
    <>
      <Grid divided centered widths="equal">
        <GridRow>
          <Header as="h1">Emails</Header>
        </GridRow>
        <GridRow columns={2} style={{ minHeight: "350px" }}>
          <GridColumn>
            <Header as="h2">Students</Header>
            <Dropdown
              placeholder="Select a student"
              fluid
              search
              selection
              open={true}
              value={formik.values.selectedEmail}
              options={StudentItems}
              onChange={(e, { value }) => {
                const student = students.find(
                  (student) => student.id === value
                );
                setCurrStudent(student);
                formik.setValues({
                  student: student,
                  selectedEmail: value,
                  id: student.email.length > 0 ? student.email[0].id : 0,
                  student_id: student.id,
                  email_address: student.email_address,
                  secondary_email_address: student.secondary_email_address,
                  content:
                    student.email.length > 0 ? student.email[0].content : "",
                  content_json:
                    student.email.length > 0
                      ? student.email[0].content_json
                      : "",
                  date: student.email.length > 0 ? student.email[0].date : "",
                  approved:
                    student.email.length > 0
                      ? student.email[0].approved
                      : false,
                });
                setIsChanging(true);
              }}
            />
          </GridColumn>
          <GridColumn>
            <Header as="h2">Approved Emails</Header>
            <List style={{ maxHeight: "350px" }}>{approvedStudentItems}</List>
          </GridColumn>
        </GridRow>
        {!isChanging && (
          <EmailEditForm
            {...{ formik, currStudent, popupIsOpen, students, setStudents }}
          />
        )}
      </Grid>
    </>
  );
}

export default Emails;

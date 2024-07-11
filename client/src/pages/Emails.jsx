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
import { useOutletContext, useNavigate } from "react-router-dom";
import EmailEditForm from "../components/EmailEditForm";

/**
 * Emails component displays a form to send emails to students
 * and also displays a list of approved emails.
 */
function Emails() {
  // State variables
  const [students, setStudents] = useState([]);
  const [currStudent, setCurrStudent] = useState({});
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Context variables
  const { user } = useOutletContext();

  const navigate = useNavigate();

  // Fetch students data on component mount
  useEffect(() => {
    if (!user.email_address) {
      navigate("/login");
    } else if (!user.roles.map((r) => r.name).includes("Admin")) {
      navigate("/reports");
    }
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  // Formik form configuration
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

  // Function to handle opening popup
  function handleOpenPopup() {
    setPopupIsOpen(true);
    const timeout = setTimeout(() => {
      setPopupIsOpen(false);
    }, 2000);
  }

  // Generate dropdown options for students
  const StudentItems = students.map((student) => {
    return {
      key: student.id,
      text: `${student.first_name} ${student.last_name}`,
      value: student.id,
    };
  });

  // Generate list of approved emails
  const approvedStudentItems = students
    .filter((student) =>
      student.email.length > 0 ? student.email[0].approved : false
    )
    .map((student) => (
      <List.Item
        key={student.id}
      >{`${student.first_name} ${student.last_name}`}</List.Item>
    ));

  // State variable to track whether form is changing
  const [editForm, setEditForm] = useState(null);

  // If form is changing, wait for 10ms before rendering
  if (isChanging) {
    setTimeout(() => {
      setIsChanging(false);
    }, 10);
  }

  // Render component
  return (
    <>
      {/* Grid layout */}
      <Grid divided centered>
        {/* Header */}
        <GridRow>
          <Header as="h1">Emails</Header>
        </GridRow>
        <GridRow columns={2} style={{ minHeight: "350px" }}>
          {/* Dropdown for selecting student */}
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
                // Handle student selection
                // ...
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
          {/* List of approved emails */}
          <GridColumn>
            <Header as="h2">Approved Emails</Header>
            <List style={{ maxHeight: "350px" }}>{approvedStudentItems}</List>
          </GridColumn>
        </GridRow>
        {/* Form to send emails */}
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

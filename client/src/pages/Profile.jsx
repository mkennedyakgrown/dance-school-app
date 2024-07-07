import { useOutletContext } from "react-router-dom";
import { Button, Divider, Form, Grid } from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";

function Profile() {
  const { user, setUser } = useOutletContext();

  const formSchema = yup.object().shape({
    id: yup.number().required(),
    first_name: yup.string().required("First Name is required"),
    last_name: yup.string().required("Last Name is required"),
    email_address: yup.string().email("Invalid email address").required(),
  });

  const formik = useFormik({
    initialValues: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          setUser(data);
        });
    },
  });

  const passwordSchema = yup.object().shape({
    current_password: yup
      .string()
      .min(8, "Password must be at least 8 characters"),
    new_password: yup.string().min(8, "Password must be at least 8 characters"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("new_password"), null], "Passwords must match"),
  });

  const passwordFormik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.message === "Password changed") {
            alert("Password changed successfully");
            passwordFormik.setValues({
              current_password: "",
              new_password: "",
              confirm_password: "",
            });
          } else {
            alert("Error changing password");
          }
        });
    },
  });

  useEffect(() => {
    formik.setValues({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
    });
  }, [user]);

  return (
    <>
      <h1>Profile</h1>
      <Form>
        <Grid columns={2} centered>
          <Grid.Row>
            <Grid.Column>
              <Form.Input
                id={"first_name"}
                autoComplete="first_name"
                label="First Name"
                placeholder="First Name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                id={"last_name"}
                autoComplete="last_name"
                label="Last Name"
                placeholder="Last Name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Input
                id={"email_address"}
                autoComplete="email"
                label="Email Address"
                placeholder="Email Address"
                value={formik.values.email_address}
                onChange={formik.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Button color="blue" type="submit" onClick={formik.handleSubmit}>
              Save Changes
            </Button>
          </Grid.Row>
          <Divider horizontal>Change Password</Divider>
          <Grid.Row>
            <Grid.Column>
              <Form.Input
                id={"current_password"}
                type="password"
                autoComplete="current-password"
                label="Current Password"
                placeholder="Current Password"
                value={passwordFormik.values.current_password}
                onChange={passwordFormik.handleChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                id={"new_password"}
                type="password"
                autoComplete="new-password"
                label="New Password"
                placeholder="password"
                value={passwordFormik.values.new_password}
                onChange={passwordFormik.handleChange}
              />
              <Form.Input
                id={"confirm_password"}
                type="password"
                autoComplete="new-password"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={passwordFormik.values.confirm_password}
                onChange={passwordFormik.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Button
              color="teal"
              type="submit"
              onClick={passwordFormik.handleSubmit}
            >
              Change Password
            </Button>
          </Grid.Row>
        </Grid>
      </Form>
    </>
  );
}

export default Profile;

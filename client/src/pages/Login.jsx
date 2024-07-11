// Import necessary hooks and components
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  FormField,
  Label,
  Input,
  FormGroup,
} from "semantic-ui-react";
import { useFormik } from "formik";
import * as yup from "yup";

// Define the Login component
function Login() {
  // Initialize state variables
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get the user and setUser from the outlet context
  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  // Redirect to the home page if the user is already logged in
  useEffect(() => {
    if (user.email_address) {
      navigate("/", { replace: true });
    }
  }, [user]);

  // Define the form schema for validation
  const formSchema = yup.object().shape({
    email_address: yup.string().email().required(),
    password: yup.string().required(),
  });

  // Define formik configuration
  const formik = useFormik({
    initialValues: {
      email_address: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      // Set isLoading to true
      setIsLoading(true);
      // Send a POST request to the login API
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          // If there are errors, set the errors state variable
          if (data.errors) {
            setErrors(data.errors);
          } else {
            // Set the user state variable
            setUser(data);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          // Reset the form, set isLoading to false, and navigate to the home page
          formik.resetForm();
          setIsLoading(false);
          navigate("/", { replace: true });
        });
    },
  });

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <FormGroup widths="equal">
          <FormField>
            <Label htmlFor="email_address">Email</Label>
            <Input
              id="email_address"
              name="email_address"
              type="text"
              placeholder="Email"
              autoComplete="on"
              onChange={formik.handleChange}
              value={formik.values.email_address}
            />
          </FormField>
          <FormField>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="on"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FormField>
        </FormGroup>
        <Button
          type="submit"
          color="blue"
          loading={isLoading}
          disabled={isLoading}
        >
          Login
        </Button>
        <FormField>
          {errors.map((error) =>
            error.forEach((field) => <p key={field.message}>{field.message}</p>)
          )}
        </FormField>
      </Form>
    </>
  );
}

// Export the Login component
export default Login;

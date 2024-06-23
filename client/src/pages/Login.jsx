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

function Login() {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.email_address) {
      navigate("/", { replace: true });
    }
  }, [user]);

  const formSchema = yup.object().shape({
    email_address: yup.string().email().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email_address: "",
      password: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.errors) {
            setErrors(data.errors);
          } else {
            setUser(data);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
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

export default Login;

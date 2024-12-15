import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Error, Input, FormField, Label } from "../styles";
import { useHistory } from 'react-router-dom';

function LoginForm({ onLogin }) {

    const history = useHistory();

    const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required").max(15, "Must be 15 characters or less"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values, { setSubmitting, setErrors }) => {
      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => {
          setSubmitting(false);
          if (r.ok) {
            r.json().then((user) => onLogin(user));
            history.push('/');
          } else {
            r.json().then((err) => setErrors({ server: err.errors }));
          }
        })
        .catch((error) => {
          setSubmitting(false);
          setErrors({ server: ["An unexpected error occurred"] });
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormField>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.username}
          onBlur={formik.handleBlur}
        />
        {formik.touched.username && formik.errors.username ? (
          <Error>{formik.errors.username}</Error>
        ) : null}
      </FormField>
      <FormField>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          onBlur={formik.handleBlur}
        />
        {formik.touched.password && formik.errors.password ? (
          <Error>{formik.errors.password}</Error>
        ) : null}
      </FormField>
      <FormField>
        <Button variant="fill" color="primary" type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Loading..." : "Login"}
        </Button>
      </FormField>
      <FormField>
        {formik.errors.server && formik.errors.server.map((err) => <Error key={err}>{err}</Error>)}
      </FormField>
    </form>
  );
}

export default LoginForm;
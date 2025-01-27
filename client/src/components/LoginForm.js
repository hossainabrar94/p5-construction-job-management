import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';

function LoginForm({ onLogin }) {

    const history = useHistory();

    const formik = useFormik({
    initialValues: {
        username: "",
        password: "",
    },
    validationSchema: Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
        }),
    onSubmit: (values, { setSubmitting, setErrors  }) => {
        fetch("http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        })
        // fetch("/login", {
        // method: "POST",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(values),
        // })
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
        <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="username" className="block text-[#b7b7b7] text-sm font-medium mb-1">
            Username
            </label>
            <input
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your username"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm">{formik.errors.username}</div>
            )}
        </div>
        <div>
            <label htmlFor="password" className="block text-[#b7b7b7] text-sm font-medium mb-1">
            Password
            </label>
            <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
        </div>
        <button type="submit" disabled={formik.isSubmitting} className="w-full bg-[#ba1c2f] text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50">
            {formik.isSubmitting ? "Loading..." : "Login"}
        </button>
        </form>
    );
}

export default LoginForm;
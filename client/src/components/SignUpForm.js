import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

function SignUpForm({ onSignUp }) {
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        },
        validationSchema: Yup.object({
        username: Yup.string()
            .required("Username is required")
            .max(15, "Must be 15 characters or less"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .required("Password is required")
            .min(4, "Must be at least 4 characters"),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Password confirmation is required"),
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
        fetch("http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/signup", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
            password_confirmation: values.passwordConfirmation,
            }),
        })
        // fetch("/signup", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //     username: values.username,
        //     email: values.email,
        //     password: values.password,
        //     password_confirmation: values.passwordConfirmation,
        //     }),
        // })
            .then((r) => {
            setSubmitting(false);
            if (r.ok) {
                r.json().then((user) => onSignUp(user));
                history.push("/");
            } else {
                r.json().then((err) =>
                setErrors({ server: err.errors || ["An error occurred"] })
                );
            }
            })
            .catch((error) => {
            setSubmitting(false);
            setErrors({
                server: ["An unexpected error occurred. Please try again."],
            });
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
            id="username"
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            onBlur={formik.handleBlur}
            placeholder="Enter your username"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.username && formik.errors.username && (
            <div className="text-red-500 text-sm">{formik.errors.username}</div>
            )}
        </div>
        <div>
            <label htmlFor="email" className="block text-[#b7b7b7] text-sm font-medium mb-1">
                Email
            </label>
            <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
        </div>
        <div>
            <label htmlFor="password" className="block text-[#b7b7b7] text-sm font-medium mb-1">
                Password
            </label>
            <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm">{formik.errors.password}</div>
            )}
        </div>
        <div>
            <label htmlFor="passwordConfirmation" className="block text-[#b7b7b7] text-sm font-medium mb-1">
                Password Confirmation
            </label>
            <input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.passwordConfirmation}
            onBlur={formik.handleBlur}
            placeholder="Confirm your password"
            className="w-full p-2 rounded-md text-[#b7b7b7] bg-gray-800 placeholder-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation && (
                <div className="text-red-500 text-sm">
                {formik.errors.passwordConfirmation}
                </div>
            )}
        </div>
        <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#ba1c2f] text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
            {formik.isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
        {formik.errors.server &&
            formik.errors.server.map((err, index) => (
            <div key={index} className="text-red-500 text-sm">
                {err}
            </div>
            ))}
        </form>
    );
}

export default SignUpForm;
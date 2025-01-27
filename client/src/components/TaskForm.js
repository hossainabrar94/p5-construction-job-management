import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function TaskForm({ projectId, existingTask, onSuccess }) {
    const isEditing = Boolean(existingTask);

    const formik = useFormik({
        initialValues: {
        name: existingTask?.name || "",
        description: existingTask?.description || "",
        status: existingTask?.status || "Not Started",
        },
        validationSchema: Yup.object({
        name: Yup.string().required("Task name is required"),
        description: Yup.string().max(200, "Description must be under 200 characters"),
        status: Yup.string().required("Status is required"),
        }),
        onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
        const url = isEditing ? `http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${projectId}/tasks/${existingTask.id}`: `http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${projectId}/tasks`;
        // const url = isEditing ? `/projects/${projectId}/tasks/${existingTask.id}`: `/projects/${projectId}/tasks`;
        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
            credentials: "include",
        })
            .then((r) => {
            setSubmitting(false);
            if (r.ok) {
                r.json().then(() => {
                if (onSuccess) onSuccess();
                if (!isEditing) {
                    resetForm();
                }
                });
            } else {
                r.json().then((err) => {
                setErrors({ server: err.errors || ["An error occurred"] });
                });
            }
            })
            .catch(() => {
            setSubmitting(false);
            setErrors({ server: ["An unexpected error occurred. Please try again."] });
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="bg-gray-800 p-4 rounded space-y-3 mb-4">
        {formik.errors.server && formik.errors.server.map((err, idx) => (
            <div key={idx} className="text-red-500 text-sm">
            {err}
            </div>
        ))}

        <div>
            <label className="block mb-1 text-[#b7b7b7]" htmlFor="name">Task Name</label>
            <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g., Drywall Install"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                        border border-gray-600 focus:outline-none
                        focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
        </div>

        <div>
            <label className="block mb-1 text-[#b7b7b7]" htmlFor="description">Description</label>
            <textarea
            id="description"
            name="description"
            rows="2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder="Short note about this task"
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                        border border-gray-600 focus:outline-none
                        focus:ring-2 focus:ring-[#ba1c2f]"
            />
            {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
            )}
        </div>

        <div>
            <label className="block mb-1 text-[#b7b7b7]" htmlFor="status">Status</label>
            <select
            id="status"
            name="status"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.status}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                        border border-gray-600 focus:outline-none
                        focus:ring-2 focus:ring-[#ba1c2f]"
            >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            </select>
            {formik.touched.status && formik.errors.status && (
            <div className="text-red-500 text-sm">{formik.errors.status}</div>
            )}
        </div>

        <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-[#ba1c2f] mt-2 py-2 rounded-md text-white
                    font-semibold hover:bg-red-700 transition-colors
                    disabled:opacity-50"
        >
            {formik.isSubmitting ? "Saving..." : (isEditing ? "Update Task" : "Create Task")}
        </button>
        </form>
    );
}

export default TaskForm;
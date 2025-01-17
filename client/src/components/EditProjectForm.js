import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function EditProjectForm({ existingProject, onUpdate }) {
  
    const formik = useFormik({
        initialValues: {
            name: existingProject.name || "",
            description: existingProject.description || "",
            start_date: existingProject._start_date || "",
            end_date: existingProject._end_date || "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Project name is required"),
            description: Yup.string().max(200, "Max 200 chars"),
            start_date: Yup.date().nullable(),
            end_date: Yup.date().nullable(),
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
            fetch(`/projects/${existingProject.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            .then((r) => {
                setSubmitting(false);
                if (r.ok) {
                    r.json().then((updatedProj) => {
                    if (onUpdate) onUpdate(updatedProj);
                    });
                } else {
                    r.json().then((err) => {
                    setErrors({ server: err.errors || ["An error occurred"] });
                    });
                }
            })
            .catch(() => {
                setSubmitting(false);
                setErrors({ server: ["Unexpected error occurred."] });
            });
        },
    });

  return (
    <form onSubmit={formik.handleSubmit} className="bg-gray-800 p-4 rounded space-y-4">
      {formik.errors.server &&
        formik.errors.server.map((e, idx) => (
          <div key={idx} className="text-red-500 text-sm">
            {e}
          </div>
        ))}

      <div>
        <label htmlFor="name" className="block mb-1 text-[#b7b7b7]">
          Project Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"/>
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 text-[#b7b7b7]">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                     border border-gray-600 focus:outline-none
                     focus:ring-2 focus:ring-[#ba1c2f]"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-sm">{formik.errors.description}</div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="start_date" className="block mb-1 text-[#b7b7b7]">
            Start Date
          </label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.start_date}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                       border border-gray-600 focus:outline-none
                       focus:ring-2 focus:ring-[#ba1c2f]"
          />
          {formik.touched.start_date && formik.errors.start_date && (
            <div className="text-red-500 text-sm">{formik.errors.start_date}</div>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="end_date" className="block mb-1 text-[#b7b7b7]">
            End Date
          </label>
          <input
            id="end_date"
            name="end_date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.end_date}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]" />
          {formik.touched.end_date && formik.errors.end_date && (
            <div className="text-red-500 text-sm">{formik.errors.end_date}</div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="bg-[#ba1c2f] text-white px-3 py-1 mt-3 rounded hover:bg-red-700 transition disabled:opacity-50"
      >
        {formik.isSubmitting ? "Updating..." : "Update Project"}
      </button>
    </form>
  );
}

export default EditProjectForm;
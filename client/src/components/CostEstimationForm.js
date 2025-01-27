import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function CostEstimationForm({projectId, costEstimate, onSuccess,}) {
  // creating cost estimattion or editing?
  const isEditing = !!costEstimate;

  const initialValues = {
    labor_cost: costEstimate ? costEstimate.labor_cost : 0,
    material_cost: costEstimate ? costEstimate.material_cost : 0,
    other_cost: costEstimate ? costEstimate.other_cost : 0,
  };

  const validationSchema = Yup.object({
    labor_cost: Yup.number().typeError("Must be a number").min(0, "No negative").required(),
    material_cost: Yup.number().typeError("Must be a number").min(0).required(),
    other_cost: Yup.number().typeError("Must be a number").min(0).required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      const url = isEditing ? `http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${projectId}/cost_estimates/${costEstimate.id}` : `http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${projectId}/cost_estimates`
      // const url = isEditing ? `/projects/${projectId}/cost_estimates/${costEstimate.id}` : `/projects/${projectId}/cost_estimates`
      const method = isEditing ? "PUT" : "POST";

      fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((r) => {
          setSubmitting(false);
          if (r.ok) {
            r.json().then((data) => {
              if (onSuccess) onSuccess(data);
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
          setErrors({ server: ["Unexpected error. Try again."] });
        });
    },
  });

  const total = Number(formik.values.labor_cost || 0)
    + Number(formik.values.material_cost || 0)
    + Number(formik.values.other_cost || 0);

  return (
    <div className="bg-gray-800 p-4 rounded-md text-white">
      {isEditing ? (
        <h3 className="text-xl font-bold mb-2">Edit Cost Estimate</h3>
      ) : (
        <h3 className="text-xl font-bold mb-2">Add Cost Estimate</h3>
      )}

      {formik.errors.server &&
        formik.errors.server.map((err, idx) => (
          <div key={idx} className="text-red-500 text-sm">
            {err}
          </div>
        ))}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="labor_cost" className="block mb-1 text-[#b7b7b7]">
            Labor Cost
          </label>
          <input
            id="labor_cost"
            name="labor_cost"
            type="number"
            step="0.01"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.labor_cost}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                       border border-gray-600 focus:outline-none
                       focus:ring-2 focus:ring-[#ba1c2f]"
          />
          {formik.touched.labor_cost && formik.errors.labor_cost && (
            <div className="text-red-500 text-sm">{formik.errors.labor_cost}</div>
          )}
        </div>

        <div>
          <label htmlFor="material_cost" className="block mb-1 text-[#b7b7b7]">
            Material Cost
          </label>
          <input
            id="material_cost"
            name="material_cost"
            type="number"
            step="0.01"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.material_cost}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                       border border-gray-600 focus:outline-none
                       focus:ring-2 focus:ring-[#ba1c2f]"
          />
          {formik.touched.material_cost && formik.errors.material_cost && (
            <div className="text-red-500 text-sm">{formik.errors.material_cost}</div>
          )}
        </div>

        <div>
          <label htmlFor="other_cost" className="block mb-1 text-[#b7b7b7]">
            Other Cost
          </label>
          <input
            id="other_cost"
            name="other_cost"
            type="number"
            step="0.01"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.other_cost}
            className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7]
                       border border-gray-600 focus:outline-none
                       focus:ring-2 focus:ring-[#ba1c2f]"
          />
          {formik.touched.other_cost && formik.errors.other_cost && (
            <div className="text-red-500 text-sm">{formik.errors.other_cost}</div>
          )}
        </div>

        <div className="text-md text-gray-300">
          <strong>Calculated Total:</strong> ${total.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-[#ba1c2f] py-2 rounded-md text-white
                     font-semibold hover:bg-red-700 transition-colors
                     disabled:opacity-50"
        >
          {formik.isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Estimate"
            : "Add Estimate"}
        </button>
      </form>
    </div>
  );
}

export default CostEstimationForm;
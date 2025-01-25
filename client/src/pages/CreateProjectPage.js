import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";

function CreateProjectPage({ user, handleAddedProject }) {

    const [allTags, setAllTags] = useState([]);
    const history = useHistory();

    useEffect(() => {
        fetch("http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/tags")
        .then((r) => r.json())
        .then((data) => {
            setAllTags(data); 
        })
        .catch(console.error);
    }, []);
    // useEffect(() => {
    //     fetch("/tags")
    //     .then((r) => r.json())
    //     .then((data) => {
    //         setAllTags(data); 
    //     })
    //     .catch(console.error);
    // }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            tag_ids: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Project name is required"),
            description: Yup.string().max(200, "Description must be 200 characters or less"),
            start_date: Yup.date().nullable(),
        }),
        onSubmit: (values, { setSubmitting, setErrors }) => {
            fetch("http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            // fetch("/projects", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(values),
            // })
            .then((r) => {
                setSubmitting(false);
                if (r.ok) {
                    r.json().then((newProject) => {
                    if (handleAddedProject) handleAddedProject(newProject);
                    history.push(`/projects/${newProject.id}`);
                    });
                } else {
                    r.json().then((err) => {
                    setErrors({ server: err.errors });
                    });
                }
            })
            .catch(() => {
                setSubmitting(false);
                setErrors({
                    server: ["An unexpected error occurred. Please try again."],
                });
            });
        },
    });

    function handleTagSelection(e) {
        const selectedTagIds = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
        formik.setFieldValue("tag_ids", selectedTagIds);
    }
    
    
    if (!user) {
        return (
        <div className="text-center text-red-500 mt-10">
            <p>You must be logged in to create a project.</p>
        </div>
        );
    }

    return (
        <div className="max-w-[600px] mx-auto mt-10 text-white">
            <h1 className="text-3xl font-bold mb-4">Create a New Project</h1>

            <form onSubmit={formik.handleSubmit} className="bg-gray-800 p-6 rounded-md space-y-4">
                {formik.errors.server && formik.errors.server.map((err, idx) => (
                    <div key={idx} className="text-red-500 text-sm">
                        {err}
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
                    placeholder="Kitchen Remodel"
                    className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
                    />
                    {formik.touched.name && formik.errors.name && ( <div className="text-red-500 text-sm">{formik.errors.name}</div>)}
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
                    placeholder="Short description..."
                    className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
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
                        className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
                        />
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
                        className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 text-[#b7b7b7]">Select Tags:</label>
                    <select
                    multiple
                    value={formik.values.tag_ids.map(String)} 
                    onChange={handleTagSelection}
                    className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
                    style={{ minHeight: "5rem" }}
                    >
                        {allTags.map(tag => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-[#ba1c2f] mt-4 py-2 rounded-md text-white ont-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                    {formik.isSubmitting ? "Creating..." : "Create Project"}
                </button>
            </form>
        </div>
    );
}

export default CreateProjectPage;
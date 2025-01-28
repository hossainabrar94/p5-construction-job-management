import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ProjectsContext } from "../components/ProjectsContext";

function MyProjectsPage({ user }) {

    const { projects } = useContext(ProjectsContext);
    
    if (!user) {
        return (
        <div className="text-center text-red-500 mt-10">
            <p>You must be logged in to view your projects.</p>
        </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
        <div className="text-center text-gray-400 mt-10">
            <p>No projects found. Create one!</p>
        </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto p-4 text-white">
            <h1 className="text-3xl font-bold mb-4">My Projects</h1>
            <div className="space-y-4">
                {projects.map((project) => (
                <div key={project.id} className="bg-gray-800 p-4 rounded shadow hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold">{project.name}</h2>
                    <p className="text-gray-400 text-sm mb-2">
                        {project._start_date ? `Start: ${project._start_date}` : "No start date"}
                        {" "} &mdash;{" "}
                        {project._end_date ? `End: ${project._end_date}` : "No end date"}
                    </p>
                    <p className="text-gray-300 line-clamp-2">
                        {project.description || "No description provided."}
                    </p>
                    <p className="mt-2 text-gray-400 text-sm italic">
                        {project.tags && project.tags.length > 0 ? (
                            <>
                            <strong>Job Type:</strong>{" "}
                            {project.tags.map((tag, index) => (
                                <span key={tag.id}>
                                    {tag.name}
                                    {index < project.tags.length - 1 && ", "}
                                </span>
                            ))}
                            </>
                        ) : (
                            "No tags"
                        )}
                    </p>
                    <Link to={`/projects/${project.id}`} className="inline-block mt-3 bg-[#ba1c2f] text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                        View Details
                    </Link>
                </div>
                ))}
            </div>
        </div>
    );
    }

    export default MyProjectsPage;
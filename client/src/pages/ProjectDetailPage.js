import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../components/ProjectsContext";
import { useParams, useHistory } from "react-router-dom";
import CostEstimationForm from "../components/CostEstimationForm";
import TaskForm from "../components/TaskForm";
import EditProjectForm from "../components/EditProjectForm";
import EditTagsForm from "../components/EditTagForm";

function ProjectDetailPage({ user }) {
    const { id } = useParams(); 
    const { projects, setProjects, deleteProject, updateProject } = useContext(ProjectsContext);
    const [project, setProject] = useState(null);
    const [editingEstimate, setEditingEstimate] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [editingProject, setEditingProject] = useState(false);
    const [showTagEditor, setShowTagEditor] = useState(false);
    const history = useHistory();


    // useEffect(() => {
    //     fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}`, {credentials: "include"})
    //         .then((r) => r.json())
    //         .then((proj) => setProject(proj))
    //         .catch((err) => console.error(err));
    //     fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}/tasks`, {credentials: "include"})
    //         .then((r) => r.json())
    //         .then((taskArr) => setTasks(taskArr))
    //         .catch((err) => console.error(err));
    // }, [id]);
    useEffect(() => {
        fetch(`/projects/${id}`)
            .then((r) => r.json())
            .then((proj) => setProject(proj))
            .catch((err) => console.error(err));
        fetch(`/projects/${id}/tasks`)
            .then((r) => r.json())
            .then((taskArr) => setTasks(taskArr))
            .catch((err) => console.error(err));
    }, [id]);

    // function refreshProject() {
    //     fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}`, {credentials: "include"})
    //     .then(r => r.json())
    //     .then(setProject)
    //     .catch(console.error);

    //     fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}/tasks`, {credentials: "include"})
    //     .then(r => r.json())
    //     .then(setTasks)
    //     .catch(console.error);
    // }
    function refreshProject() {
        fetch(`/projects/${id}`)
        .then(r => r.json())
        .then(setProject)
        .catch(console.error);

        fetch(`/projects/${id}/tasks`)
        .then(r => r.json())
        .then(setTasks)
        .catch(console.error);
    }

    function handleEstimateCreatedOrUpdated() {
        setEditingEstimate(null); 
        refreshProject(); 
    }

    function handleTaskCreatedOrUpdated() {
        setEditingTask(null);
        refreshProject();
    }

    function handleDeleteTask(taskId) {
        // fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}/tasks/${taskId}`, {
        //     method: "DELETE",
        //     credentials: "include",
        // })
        fetch(`/projects/${id}/tasks/${taskId}`, {
            method: "DELETE",
        })
        .then((r) => {
            if (r.ok) {
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            } else {
            r.json().then((err) => console.error(err));
            }
        })
        .catch(console.error);
    }

    function handleDeleteProject() {
        // fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${id}`, {
        //     method: "DELETE",
        //     credentials: "include"
        // })
        fetch(`/projects/${id}`, {
            method: "DELETE",
        })
        .then((r) => {
            if (r.ok) {
                alert("Project deleted.");
                deleteProject(Number(id));
                history.push("/projects");
            } else {
                r.json().then((err) => {
                alert("Failed to delete project: " + (err.errors || []).join(", "));
                });
            }
        })
        .catch(() => alert("An unexpected error occurred while deleting."));
      }
    
    function handleDeleteCostEstimate(ceId) {
        // fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${project.id}/cost_estimates/${ceId}`, {
        //     method: "DELETE",
        // })
        fetch(`/projects/${project.id}/cost_estimates/${ceId}`, {
            method: "DELETE",
        })
        .then((r) => {
            if (r.ok) {
                refreshProject(); 
            } else {
                r.json().then(console.error);
            }
        })
        .catch(console.error);
    }
    
    function handleProjectUpdated(updatedProject) {
        setEditingProject(false);
        setProject(updatedProject);
        updateProject(updatedProject); 
    }

    function handleRemoveTag(tagId) {
        // fetch(`http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/projects/${project.id}/tags/${tagId}`, {
        //     method: "DELETE",
        // })
        fetch(`/projects/${project.id}/tags/${tagId}`, {
            method: "DELETE",
        })
        .then((r) => {
            if (!r.ok) throw new Error("Failed to remove tag");
            setProject((prev) => ({
                ...prev,
                tags: prev.tags.filter((t) => t.id !== tagId),
            }));
        })
        .catch((err) => console.error(err));
    }

    function handleTagsUpdated(newTags) {
        setShowTagEditor(false);
        setProject((prev) => ({
            ...prev,
            tags: newTags
        }));
    }
    
    if (!user) {
        return <div className="text-red-500">You must be logged in to see project details.</div>;
    }
    if (!project) {
        return <div className="text-white">Loading project...</div>;
    }

    if (editingProject) {
        return (
            <div className="max-w-[800px] mx-auto p-4 text-white">
                <h2 className="text-xl font-bold mb-4">Editing Project: {project.name}</h2>
                <EditProjectForm existingProject={project} onUpdate={handleProjectUpdated} />
                <button onClick={() => setEditingProject(false)} className="mt-4 bg-gray-700 px-3 py-1 rounded text-white hover:bg-gray-600">
                    Cancel Edit
                </button>
            </div>
        );
    }
    
    return (
        <div className="max-w-[800px] mx-auto p-4 text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <div>
                    <button onClick={() => setEditingProject(true)} className="bg-blue-600 px-3 py-1 rounded mr-3 hover:bg-blue-500" >
                        Edit Project
                    </button>
                    <button onClick={handleDeleteProject} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">
                        Delete Project
                    </button>
                </div>
            </div>

            <p className="mb-4">{project.description}</p>
            <p className="text-sm text-gray-400">
                Start: {project._start_date || "N/A"} | End: {project._end_date || "N/A"}
            </p>

            <hr className="my-4 border-gray-600" />
            <h2 className="text-xl font-bold mb-2">Cost Estimates</h2>
            {project.cost_estimates?.length > 0 ? (
            <div className="space-y-2 mb-4">
                {project.cost_estimates.map((ce) => (
                <div key={ce.id} className="bg-gray-700 p-2 rounded">
                    <p>Labor: ${ce.labor_cost}</p>
                    <p>Material: ${ce.material_cost}</p>
                    <p>Other: ${ce.other_cost}</p>
                    <strong className="block">
                    Total: $
                    {(
                        (Number(ce.labor_cost) || 0) +
                        (Number(ce.material_cost) || 0) +
                        (Number(ce.other_cost) || 0)
                    ).toFixed(2)}
                    </strong>
                    <button onClick={() => setEditingEstimate(ce)} className="mt-2 bg-[#ba1c2f] px-2 py-1 rounded text-white hover:bg-red-600">
                        Edit
                    </button>
                    <button onClick={() => handleDeleteCostEstimate(ce.id)} className="mt-2 ml-3 bg-[#ba1c2f] px-2 py-1 rounded text-white hover:bg-red-500">
                        Delete
                    </button>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-gray-300 mb-4">No cost estimates yet.</p>
            )}
            {editingEstimate ? (
            <CostEstimationForm projectId={project.id} costEstimate={editingEstimate} onSuccess={handleEstimateCreatedOrUpdated} />
            ) : (
            <CostEstimationForm projectId={project.id} onSuccess={handleEstimateCreatedOrUpdated} />
            )}

            <hr className="my-4 border-gray-600" />
            <h2 className="text-xl font-bold mb-2">Tasks</h2>
            {tasks.length > 0 ? (
            <div className="space-y-2 mb-4">
                {tasks.map((t) => (
                <div key={t.id} className="bg-gray-700 p-2 rounded">
                    <p className="font-semibold">{t.name}</p>
                    <p>{t.description}</p>
                    <p>Status: {t.status}</p>
                    <button className="mt-2 mr-2 bg-blue-600 px-2 py-1 rounded hover:bg-blue-500" onClick={() => setEditingTask(t)}>
                        Edit
                    </button>
                    <button className="mt-2 bg-red-600 px-2 py-1 rounded hover:bg-red-500" onClick={() => handleDeleteTask(t.id)}>
                        Delete
                    </button>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-gray-300 mb-4">No tasks yet.</p>
            )}
            {editingTask ? (
                <TaskForm projectId={project.id} existingTask={editingTask} onSuccess={handleTaskCreatedOrUpdated} />
                ) : (
                <TaskForm projectId={project.id} onSuccess={handleTaskCreatedOrUpdated} />
            )}

            <h2 className="text-xl font-bold mb-2">Tags</h2>
                {project.tags?.length > 0 ? (
                    <div className="space-y-2 mb-4">
                        {project.tags.map((tag) => (
                            <div key={tag.id} className="bg-gray-700 p-2 rounded flex items-center justify-between">
                                <span>{tag.name}</span>
                                <button onClick={() => handleRemoveTag(tag.id)} className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-300 mb-4">No tags for this project yet.</p>
                )}

                {!showTagEditor ? (
                    <button
                    onClick={() => setShowTagEditor(true)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                    >
                        Edit/Attach Tags
                    </button>
                ) : (
                    <EditTagsForm
                    projectId={project.id}
                    currentTags={project.tags}
                    onTagsUpdated={handleTagsUpdated}
                    onCancel={() => setShowTagEditor(false)}
                    />
                )}
        </div>
    );
}

export default ProjectDetailPage;
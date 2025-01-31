import React, { useEffect, useState } from "react";

function EditTagsForm({ projectId, currentTags = [], onTagsUpdated, onCancel }) {
    const [allTags, setAllTags] = useState([]);
    const [selectedTagIds, setSelectedTagIds] = useState(currentTags.map((t) => t.id));

    useEffect(() => {
        fetch("/tags")
        .then((r) => r.json())
        .then(setAllTags)
        .catch(console.error);
    }, []);

    function handleSelectChange(e) {
        const ids = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
        setSelectedTagIds(ids);
    }

    function handleSubmit(e) {
        e.preventDefault();
        fetch(`/projects/${projectId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag_ids: selectedTagIds }),
        })
        .then((r) => r.json())
        .then((updatedProject) => {
            if (onTagsUpdated) onTagsUpdated(updatedProject.tags);
        })
        .catch(console.error);
    }

    return (
        <div className="bg-gray-800 p-4 rounded-md text-white my-2">
        <h2 className="text-xl font-bold mb-2">Edit/Add Tags</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label className="block mb-1 text-[#b7b7b7]">
                    Select Tags (Ctrl+click or Cmd+click to multi-select)
                </label>
                <select
                    multiple
                    value={selectedTagIds.map(String)}
                    onChange={handleSelectChange}
                    className="w-full p-2 rounded-md bg-gray-700 text-[#b7b7b7] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ba1c2f]"
                    style={{ minHeight: "5rem" }}
                >
                    {allTags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                    ))}
                </select>
            </div>

            <div className="mt-3 flex gap-3">
                <button
                    type="submit"
                    className="bg-[#ba1c2f] px-3 py-1 rounded text-white hover:bg-red-700"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 px-3 py-1 rounded text-white hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
        </div>
    );
}

export default EditTagsForm;
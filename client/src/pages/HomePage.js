import React from 'react';
import { Link } from "react-router-dom";
import {ReactTyped} from 'react-typed'

function HomePage({ user, projects }) {

    const safeProjects = projects || [];

    return (        
        <div className="text-white">
            {user ? (
                <div className="max-w-[800px] mx-auto mt-8 px-4">
                    <h2 className="text-2xl font-bold text-[#ba1c2f] mb-4">
                        Your Recent Projects
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Welcome{" "}
                        <span className="text-white font-medium">
                            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
                        </span>
                        ! Here are your latest projects:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {safeProjects.slice(0, 3).map((proj) => (
                        <div key={proj.id} className="bg-gray-800 p-4 rounded shadow hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold">{proj.name}</h2>
                            <Link to={`/projects/${proj.id}`} className="inline-block mt-3 bg-[#ba1c2f] text-white px-3 py-1 rounded hover:bg-red-700 transition-colors" >
                                View Details
                            </Link>
                        </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-[800px] mx-auto mt-8 px-4 text-center text-gray-400">
                    <p>Please log in or sign up to see your projects.</p>
                </div>
            )}
        </div>
    );
}

export default HomePage;
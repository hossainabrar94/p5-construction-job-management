import React from 'react';
import { MdConstruction } from "react-icons/md";
import { Link } from "react-router-dom";

// Assuming you're using Tailwind classes for styling as per your code snippet
const Navbar = ({ user, setUser }) => {

  function handleLogoutClick() {
    fetch("http://my-env.eba-437cviwf.us-east-1.elasticbeanstalk.com/logout", { method: "DELETE" })
      .then((r) => {
        if (r.ok) {
          setUser(null);
        }
      });
  }
//   function handleLogoutClick() {
//     fetch("/logout", { method: "DELETE" })
//       .then((r) => {
//         if (r.ok) {
//           setUser(null);
//         }
//       });
//   }

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
      <h1 className='text-3xl font-bold text-[#ba1c2f] flex gap-4'>
        <Link to="/">
            <MdConstruction /> BUILDLY
        </Link>
      </h1>

      <ul className='flex gap-4 text-[#b7b7b7]'>
        {user ? (
          <>
            <li className='p-4'>
              <Link to="/">Home</Link>
            </li>
            <li className='p-4'>
              <Link to="/projects">Projects</Link>
            </li>
            <li className='p-4'>
              <Link to="/create-project">Create Project</Link>
            </li>
            <li className='p-4 cursor-pointer' onClick={handleLogoutClick}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li className='p-4'>
              <Link to="/login">Login</Link>
            </li>
            <li className='p-4'>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
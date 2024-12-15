import React from 'react';
import { MdConstruction } from "react-icons/md";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
      <h1 className='text-3xl font-bold text-[#ba1c2f] flex gap-4'> <MdConstruction /> BUILDLY</h1>
      <ul className='flex gap-4 text-[#b7b7b7]'>
        <li className='p-4'>Home</li>
        <li className='p-4'>Projects</li>
        <li className='p-4'>My Projects</li>
        <li className='p-4'> 
        <Link to="/login" className='bg-[#ba1c2f] text-white px-4 py-2 rounded'>
        Login
        </Link>    
        </li>
        <li className='p-4'>Sign Up</li>
      </ul>
    </div>
  );
};

export default Navbar;
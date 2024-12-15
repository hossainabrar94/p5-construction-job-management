import React from 'react';
import { MdConstruction } from "react-icons/md";
import {
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='max-w-[1240px] mx-auto py-16 px-4 grid lg:grid-cols-3 gap-8 text-gray-300'>
      {/* Text Section */}
      <div className='lg:col-span-2'>
        <h1 className='text-[#ba1c2f] w-full text-2xl font-bold flex items-center'>
          <MdConstruction className='mr-2'/> BUILDLY
        </h1>
        <p className='py-4'>
          Take control of your construction projects with Buildly, the all-in-one solution for managing tasks, tracking progress, and optimizing workflows. Whether you're managing teams, planning builds, or coordinating deadlines, Buildly keeps your projects on track, on time, and within budget. Streamline your business today.
        </p>
        <div className='flex my-2 gap-8'>
          <FaFacebookSquare className='text-2xl'/>
          <FaInstagram className='text-2xl'/>
          <FaTwitterSquare className='text-2xl'/>
          <FaGithubSquare className='text-2xl'/>
        </div>
      </div>
    </div>
  );
};

export default Footer;
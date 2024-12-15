import React from 'react'
import {ReactTyped} from 'react-typed'

const Hero = () => {
  return (
    <div className='text-white'>
      <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#ba1c2f] text-lg font-bold p-2'> MANAGE YOUR BUSINESS </p>
        <h1 className='font-bold text-4xl'>Construct and Manage with Buildly</h1>
        <div className='flex justify-center'>
            <p className='text-xl font-bold mt-4 py-2'>With Buildly You Can</p>
            <ReactTyped
                className='text-xl font-bold mt-4 pl-2 py-2'
                strings={['Track Jobs', 'Manage Teams', 'Optimize Tasks']}
                typeSpeed={50}
                backSpeed={80}
                loop
            />
        </div>
        {/* <p className='text-xl font-bold text-gray-500'> Construction Manage Seamlessly </p> */}
        <button className='bg-[#ba1c2f] text-black w-[200px] rounded-md font-medium my-6 mx-auto py-2'>Create Your Team</button>
      </div>
    </div>
  )
}

export default Hero
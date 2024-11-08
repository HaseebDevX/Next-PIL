import React, { useState, useEffect } from 'react';

const HalfCircleProgressBar = ({ progress = 0 }) => {
  const radius = 50; // radius of the half-circle
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className='relative flex items-center justify-center'>
      <svg width='120' height='60' xmlns='http://www.w3.org/2000/svg'>
        {/* Background Circle */}
        <circle cx='60' cy='60' r={radius} className='stroke-gray-200' strokeWidth='10' fill='none' />

        {/* Progress Circle */}
        <circle
          cx='60'
          cy='60'
          r={radius}
          className='stroke-blue-500'
          strokeWidth='10'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }} // Smooth transition
        />
      </svg>
      <div className='absolute pt-10 text-xl font-semibold text-blue-500'>{progress}%</div>
    </div>
  );
};

export default HalfCircleProgressBar;

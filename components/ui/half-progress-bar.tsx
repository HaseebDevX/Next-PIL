import React from 'react';

interface ProgressBarProps {
  progress?: number;
}

const HalfCircleProgressBar: React.FC<ProgressBarProps> = ({ progress = 0 }) => {
  const width = 210; // SVG width according to Figma
  const height = 105; // SVG height according to Figma
  const radius = 100; // Adjusted radius for the larger half-circle
  const circumference = Math.PI * radius; // Half-circle circumference (only half of a full circle's circumference)

  // Calculate the stroke-dashoffset based on progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className='relative flex items-center justify-center'>
      <svg height={height} width={width}  xmlns='http://www.w3.org/2000/svg'>
        {/* Background Circle */}
        <circle className='stroke-white' cx={width / 2}  cy={height} fill='none' r={radius}  strokeWidth='5'  />

        {/* Progress Circle */}
        <circle
          className='stroke-themeLightPurple2'
          cx={width / 2}
          cy={height}
          fill='none'
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          strokeWidth='5'
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
          transform={`rotate(-180 ${width / 2} ${height})`} // Start the progress from the bottom center
        />
      </svg>
      <div className='absolute pt-[80px] font-wicklowRegular text-[64px] text-white'>{progress}%</div>
    </div>
  );
};

export default HalfCircleProgressBar;

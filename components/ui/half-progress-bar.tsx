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
        <circle cx={width / 2} cy={height} r={radius} className='stroke-white' strokeWidth='5' fill='none' />

        {/* Progress Circle */}
        <circle
          cx={width / 2}
          cy={height}
          r={radius}
          className='stroke-themeLightPurple2'
          strokeWidth='5'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          transform={`rotate(-180 ${width / 2} ${height})`} // Start the progress from the bottom center
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      <div className='absolute pt-[80px] font-wicklowRegular text-[64px] text-white'>{progress}%</div>
    </div>
  );
};

export default HalfCircleProgressBar;

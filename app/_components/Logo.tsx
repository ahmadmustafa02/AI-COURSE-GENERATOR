import React from 'react'

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="50%" stopColor="#4ECDC4" />
          <stop offset="100%" stopColor="#45B7D1" />
        </linearGradient>
      </defs>
      
      <rect
        x="20"
        y="20"
        width="80"
        height="80"
        rx="16"
        fill="url(#logoGradient)"
        opacity="0.9"
      />
      
      <path
        d="M35 45 L50 60 L35 75"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      <rect
        x="60"
        y="45"
        width="25"
        height="30"
        rx="4"
        fill="white"
        opacity="0.95"
      />
      
      <circle
        cx="72.5"
        cy="60"
        r="8"
        fill="url(#logoGradient)"
      />
    </svg>
  )
}

export default Logo

"use client";
import React from "react";

interface RoweLogoProps {
  className?: string;
  strokeWidth?: number;
  color?: string;
  id?: string;
}

export const RoweLogo: React.FC<RoweLogoProps> = ({
  className = "w-auto h-7",
  strokeWidth = 14,
  color = "currentColor",
  id,
}) => {
  return (
    <svg
      id={id}
      viewBox="0 0 530 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="rowe logo"
    >
      {/* Letter 'r' */}
      <path
        d="M 28 42 V 140"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rowe-r-stem"
      />
      <path
        d="M 28 80 C 30 52 56 42 92 42 C 118 42 134 52 138 72"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rowe-r-arch"
      />

      {/* Letter 'o' */}
      <ellipse
        cx="206"
        cy="91"
        rx="48"
        ry="49"
        stroke={color}
        strokeWidth={strokeWidth}
        className="rowe-o"
      />

      {/* Letter 'w' */}
      <path
        d="M 286 42 C 288 88 302 140 326 140 C 342 140 354 114 362 82 C 370 114 382 140 398 140 C 422 140 436 88 438 42"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rowe-w"
      />

      {/* Letter 'e' */}
      <path
        d="M 466 91 H 524 C 524 60 504 42 478 42 C 444 42 432 66 432 91 C 432 118 448 140 480 140 C 504 140 518 128 524 112"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="rowe-e"
      />
    </svg>
  );
};

export default RoweLogo;

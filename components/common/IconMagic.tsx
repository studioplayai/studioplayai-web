
import React from 'react';

const IconMagic: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M12 3v2.355" />
        <path d="m5.636 5.636 1.666 1.666" />
        <path d="M2 12h2.355" />
        <path d="m5.636 18.364 1.666-1.666" />
        <path d="M12 21v-2.355" />
        <path d="m18.364 18.364-1.666-1.666" />
        <path d="M22 12h-2.355" />
        <path d="m18.364 5.636-1.666 1.666" />
        <path d="M14.5 9.5 12 2l-2.5 7.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12z" />
    </svg>
);

export default IconMagic;

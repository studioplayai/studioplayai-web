
import React from 'react';

const IconWand: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="m5 3-3 3 3 3 3-3-3-3z" />
        <path d="m19 15-3 3 3 3 3-3-3-3z" />
        <path d="m22 3-3 3" />
        <path d="m2 6 3 3" />
        <path d="m6 18 3 3" />
        <path d="M18 6 6 18" />
    </svg>
);

export default IconWand;

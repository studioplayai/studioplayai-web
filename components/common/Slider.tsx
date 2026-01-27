
import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Slider: React.FC<SliderProps> = (props) => {
    return (
        <div className="relative mt-2 flex h-8 items-center">
            <input
                type="range"
                min="0"
                max="100"
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
                {...props}
            />
        </div>
    );
};

export default Slider;

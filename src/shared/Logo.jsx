import React from 'react';
import logo from "../assets/logo.png"
const Logo = () => {
    return (
        <div className='flex items-end  '>
            <img src={logo} alt="" />
            <p className='font-bold text-xl'>ProFast</p>
        </div>
    );
};

export default Logo;
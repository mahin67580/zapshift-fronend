import React from 'react';
import Marquee from 'react-fast-marquee';
import CasioLogo from '../assets/brands/casio.png'; // Replace with your actual image paths
import AmazonLogo from '../assets/brands/amazon.png';
import MoonstarLogo from '../assets/brands/moonstar.png';
import StarPlusLogo from '../assets/brands/start-people 1.png';
import RandstadLogo from '../assets/brands/randstad.png';

const Brands = () => {
  return (
    <div className="py-12 bg-white">
      <div className="  px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
          We've helped thousands of sales teams
        </h2>
        
        <Marquee 
          speed={50} 
          gradient={false}
          pauseOnHover={true}
        >
          <div className="flex items-center space-x-20 py-4 mr-20    ">
            <img src={CasioLogo} alt="Casio" className="  " />
            <img src={AmazonLogo} alt="Amazon" className=" " />
            <img src={MoonstarLogo} alt="Moonstar" className=" " />
            <img src={MoonstarLogo} alt="Moonstar" className=" " />
            <img src={StarPlusLogo} alt="Star+" className=" " />
            <img src={RandstadLogo} alt="Randstad" className=" " />
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Brands;
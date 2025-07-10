import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import bnimg1 from '../assets/banner/banner1.png'
import bnimg2 from '../assets/banner/banner2.png'
import bnimg3 from '../assets/banner/banner3.png'
const Banner = () => {
    return (
        <div className='w-11/12 mx-auto pt-5'>
            <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
                <div>
                    <img src={bnimg1} />
                   
                </div>
                <div>
                    <img src={bnimg2} />
           
                </div>
                <div>
                    <img src={bnimg3} />
                   
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;
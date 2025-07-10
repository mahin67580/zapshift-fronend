import React from 'react';
import bg from '../assets/location-merchant.png'
const Service = () => {
    return (
        <div  data-aos="zoom-in-up"
            className=" py-20 w-11/12 mx-auto rounded-2xl bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')] flex items-center justify-center  flex-col-reverse lg:flex-row bg-no-repeat gap-5 "
        >


            <div className="  px-4 sm:px-6 lg:px-8 text-center ">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Merchant and Customer Satisfaction<br />
                    <span className="text-yellow-400">is Our First Priority</span>
                </h1>

                <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-white">
                    We offer the lowest delivery charge with the highest value along with 100% safety of your product.
                    Pathco courier delivers your parcels in every corner of Bangladesh right on time.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Become a Merchant
                    </button>
                    <button className="  hover:bg-white/20 border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Earn with Protest Courier
                    </button>
                </div>
            </div>
            <div>
                <img src={bg} alt="" />
            </div>
        </div>
    );
};

export default Service;
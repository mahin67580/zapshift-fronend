import React from 'react';
import TrackingIcon from '../assets/banner/Illustration.png'; // Replace with your actual image
import SafeDeliveryIcon from '../assets/banner/Vector.png'; // Replace with your actual image
import SupportIcon from '../assets/banner/Illustration.png'; // Replace with your actual image'

const Steps = () => {
    const features = [
        {
            title: "Live Parcel Tracking",
            description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipments journey and get instant status updates for complete peace of mind.",
            icon: TrackingIcon
        },
        {
            title: "100% Safe Delivery",
            description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
            icon: SafeDeliveryIcon
        },
        {
            title: "24/7 Call Center Support",
            description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
            icon: SupportIcon
        }
    ];

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center lg:flex-row text-center"   
                        >
                            <img
                                src={feature.icon}
                                alt={feature.title}
                                className="  mb-4 object-contain" data-aos="zoom-in"
                            />
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Steps;









import React, { useState } from 'react';

const CustomerComments = () => {
  // Sample customer data
  const customers = [
    {
      id: 1,
      name: "Rasel Ahamed",
      comment: "Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!",
      designation: "Software Engineer",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
    },
    {
      id: 2,
      name: "Awlad Hossin",
      comment: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
      designation: "Senior Product Designer",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
    },
    {
      id: 3,
      name: "Nasir Uddin",
      comment: "I've tried many posture correctors but this one stands out. It's comfortable and actually helps me maintain better posture without being restrictive.",
      designation: "CEO",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
    },
    {
      id: 4,
      name: "Sarah Johnson",
      comment: "As someone who works long hours at a desk, this product has been a game-changer for my back pain and overall comfort.",
      designation: "Marketing Director",
      imageUrl: "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
    },
    {
      id: 5,
      name: "Michael Chen",
      comment: "The quality is exceptional and it's noticeably improved my posture after just a few weeks of consistent use.",
      designation: "CTO",
      imageUrl: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === customers.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? customers.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="py-8 px-4 bg-gray-50  ">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center ">What our customers are saying</h2>

      <div className="relative flex items-center justify-center   py-10  ">
        <button
          onClick={prevSlide}
          className="absolute left-0 z-10 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-colors md:static md:mr-4"
        >
          &lt;
        </button>

        <div className="overflow-hidden   max-w-4xl lg:h-64     ">
          <div
            className="flex transition-transform duration-500 px-16  lg:px-40  ease-in-out"
            style={{ transform: ` translateX(calc(50% - ${currentIndex * 40}% - 50%))` }}
          >
            {customers.map((customer, index) => {
              const isActive = index === currentIndex;
              

              return (
                <div
                  key={customer.id}
                  className={`flex-shrink-0  px-4 transition-all  duration-300 ${isActive ? 'w-full ' : 'w-2/3   opacity-60 scale-90'
                    }`}
                >
                  <div className={`bg-white p-6 rounded-lg shadow-md lg:h-full h-96 transition-all duration-300 ${isActive ? 'border-2 border-blue-500' : 'border border-gray-200'
                    }`}>
                    <p className={`italic mb-4 ${isActive ? 'text-gray-700 lg:text-lg ' : 'text-gray-500'
                      }`}>"{customer.comment}"</p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={customer.imageUrl}
                        alt={customer.name}
                        className={`rounded-full object-cover transition-all duration-300 ${isActive ? 'w-16 h-16' : 'w-12 h-12'
                          }`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/100";
                        }}
                      />
                      <div>
                        <h4 className={`font-semibold ${isActive ? 'text-gray-800 lg:text-xl' : 'text-gray-700'
                          }`}>{customer.name}</h4>
                        <p className={`${isActive ? 'text-gray-600' : 'text-gray-400'
                          }`}>{customer.designation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="absolute right-0 z-10 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-colors md:static md:ml-4"
        >
          &gt;
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {customers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerComments;
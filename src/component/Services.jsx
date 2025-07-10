import { motion } from "framer-motion";
import {
    FaTruckFast,
    FaMapLocationDot,
    FaBoxesStacked,
    FaMoneyBillWave,
    FaBuilding
} from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";

const Services = () => {
    const services = [
        {
            icon: <FaTruckFast className="text-4xl text-blue-600" />,
            title: "Express & Standard Delivery",
            description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Syihei, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off."
        },
        {
            icon: <FaMapLocationDot className="text-4xl text-green-600" />,
            title: "Nationwide Delivery",
            description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours."
        },
        {
            icon: <FaBoxesStacked className="text-4xl text-purple-600" />,
            title: "Fulfillment Solution",
            description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support."
        },
        {
            icon: <FaMoneyBillWave className="text-4xl text-orange-600" />,
            title: "Cash on Home Delivery",
            description: "COD: cash on delivery anywhere in Bangladesh with guaranteed safety of your product."
        },
        {
            icon: <FaBuilding className="text-4xl text-red-600" />,
            title: "Corporate Service / Contract In Logistics",
            description: "Customized corporate services which includes warehouse and inventory management support."
        },
        {
            icon: <FaExchangeAlt className="text-4xl text-teal-600" />,
            title: "Parcel Return",
            description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
                        >
                            <div className="mb-4 flex justify-center">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                                {service.title}
                            </h3>
                            <p className="text-gray-600 flex-grow">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Services;
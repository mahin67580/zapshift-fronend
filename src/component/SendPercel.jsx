import { useForm } from "react-hook-form";
import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";
import { AuthContext } from "../Provider/AuthContext";
import AxiosSequre from "../hook/AxiosSequre";


export default function SendParcel() {
    const Centers = useLoaderData();
    const { user } = use(AuthContext)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            senderName: user.displayName, // Prefilled sender name
        },
    });
    const AxiosSecure = AxiosSequre();
    const [senderDistricts, setSenderDistricts] = useState([]);
    const [receiverDistricts, setReceiverDistricts] = useState([]);
    const [senderCities, setSenderCities] = useState([]);
    const [receiverCities, setReceiverCities] = useState([]);
    const [senderAreas, setSenderAreas] = useState([]);
    const [receiverAreas, setReceiverAreas] = useState([]);
    const [deliveryCost, setDeliveryCost] = useState(0);

    // Get unique regions
    const uniqueRegions = [...new Set(Centers.map(center => center.region))];

    // Watch form fields
    const parcelType = watch("parcelType");
    const senderRegion = watch("senderRegion");
    const receiverRegion = watch("receiverRegion");
    const senderDistrict = watch("senderDistrict");
    const receiverDistrict = watch("receiverDistrict");
    const senderCity = watch("senderCity");
    const receiverCity = watch("receiverCity");
    const weight = watch("weight") || 0;

    // Calculate delivery cost
    useEffect(() => {
        if (parcelType && (parcelType === "document" || weight > 0)) {
            let calculatedCost = 0;
            const isSameCity = senderCity && receiverCity && senderCity === receiverCity;

            if (parcelType === "document") {
                calculatedCost = isSameCity ? 60 : 80;
            } else { // non-document
                if (weight <= 3) {
                    calculatedCost = isSameCity ? 110 : 150;
                } else {
                    const extraWeight = Math.ceil(weight - 3); // Round up to nearest kg
                    const baseCost = isSameCity ? 110 : 150;
                    const extraCost = extraWeight * 40;
                    calculatedCost = baseCost + extraCost + (isSameCity ? 0 : 40); // Extra 40 for outside city
                }
            }

            setDeliveryCost(calculatedCost.toFixed(2));
        }
    }, [parcelType, weight, senderCity, receiverCity]);

    // Update districts when regions change
    useEffect(() => {
        if (senderRegion) {
            const districts = [...new Set(
                Centers
                    .filter(center => center.region === senderRegion)
                    .map(center => center.district)
            )];
            setSenderDistricts(districts);
        } else {
            setSenderDistricts([]);
            setSenderCities([]);
            setSenderAreas([]);
        }
    }, [senderRegion, Centers]);

    useEffect(() => {
        if (receiverRegion) {
            const districts = [...new Set(
                Centers
                    .filter(center => center.region === receiverRegion)
                    .map(center => center.district)
            )];
            setReceiverDistricts(districts);
        } else {
            setReceiverDistricts([]);
            setReceiverCities([]);
            setReceiverAreas([]);
        }
    }, [receiverRegion, Centers]);

    // Update cities when district changes
    useEffect(() => {
        if (senderRegion && senderDistrict) {
            const cities = [...new Set(
                Centers
                    .filter(center => center.region === senderRegion && center.district === senderDistrict)
                    .map(center => center.city)
            )];
            setSenderCities(cities);
        } else {
            setSenderCities([]);
            setSenderAreas([]);
        }
    }, [senderDistrict, senderRegion, Centers]);

    useEffect(() => {
        if (receiverRegion && receiverDistrict) {
            const cities = [...new Set(
                Centers
                    .filter(center => center.region === receiverRegion && center.district === receiverDistrict)
                    .map(center => center.city)
            )];
            setReceiverCities(cities);
        } else {
            setReceiverCities([]);
            setReceiverAreas([]);
        }
    }, [receiverDistrict, receiverRegion, Centers]);

    // Update areas when city changes
    useEffect(() => {
        if (senderRegion && senderDistrict && senderCity) {
            const center = Centers.find(
                c => c.region === senderRegion &&
                    c.district === senderDistrict &&
                    c.city === senderCity
            );
            setSenderAreas(center ? center.covered_area : []);
        } else {
            setSenderAreas([]);
        }
    }, [senderCity, senderDistrict, senderRegion, Centers]);

    useEffect(() => {
        if (receiverRegion && receiverDistrict && receiverCity) {
            const center = Centers.find(
                c => c.region === receiverRegion &&
                    c.district === receiverDistrict &&
                    c.city === receiverCity
            );
            setReceiverAreas(center ? center.covered_area : []);
        } else {
            setReceiverAreas([]);
        }
    }, [receiverCity, receiverDistrict, receiverRegion, Centers]);


    function generateTrackingId() {
        // Get current timestamp (last 6 digits)
        const timestamp = Date.now().toString().slice(-6);

        // Generate random alphanumeric characters (4 digits)
        const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();

        // Get current hour and minute (4 digits)
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeCode = hours + minutes;

        // Combine all parts with a separator
        return `TRK-${timestamp}-${randomChars}-${timeCode}`;
    }


    const onSubmit = (data) => {
        Swal.fire({
            title: "Confirm Delivery",
            html: `The estimated delivery cost is <strong>৳ ${deliveryCost}</strong>. Do you want to proceed?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                const parcelData = {
                    ...data,
                    tracking_id: generateTrackingId(), // Add the generated tracking ID
                    created_by: user.email,
                    payment_status: 'unpaid',
                    delivery_status: 'not_collected',
                    creation_date: new Date().toISOString(),
                    cost: deliveryCost,
                };

                //console.log("Saving to database:", parcelData);

                AxiosSecure.post('/parcels', parcelData)
                    .then(res => {
                        // console.log(res.data);
                        if (res.data.success) {
                            Swal.fire({
                                title: "Success!",
                                text: "Your parcel has been scheduled for delivery.",
                                icon: "success",
                            }).then(() => {
                                reset();
                            });
                        }
                    })
            }
        });
    };

    return (
        <div className="  p-6 bg-base-100 rounded-lg shadow-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-primary">Parcel Delivery</h1>
                <p className="text-gray-600 mt-2">
                    Fill out the form below to schedule your parcel delivery
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Information Section */}
                <div className="card bg-base-200 p-6">
                    <h2 className="text-xl font-semibold mb-4">Parcel Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Parcel Type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Parcel Type*</span>
                            </label>
                            <select
                                className={`select select-bordered w-full ${errors.parcelType ? "select-error" : ""}`}
                                {...register("parcelType", { required: "Parcel type is required" })}
                            >
                                <option value="">Select type</option>
                                <option value="document">Document</option>
                                <option value="non-document">Non-Document</option>
                            </select>
                            {errors.parcelType && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.parcelType.message}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Parcel Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Parcel Title*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Important Documents"
                                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                                {...register("title", { required: "Title is required" })}
                            />
                            {errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.title.message}</span>
                                </label>
                            )}
                        </div>

                        {/* Weight (only shown for non-document) */}
                        {parcelType === "non-document" && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Weight (kg)</span>
                                </label>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    placeholder="e.g. 1.5"
                                    className="input input-bordered w-full"
                                    {...register("weight", { min: { value: 0.1, message: "Minimum weight is 0.1kg" } })}
                                />
                                {errors.weight && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.weight.message}</span>
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-around">
                    {/* Sender Information Section */}
                    <div className="card   w-full bg-base-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Sender Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Sender name"
                                    className={`input input-bordered w-full ${errors.senderName ? "input-error" : ""}`}
                                    {...register("senderName", { required: "Sender name is required" })}
                                />
                                {errors.senderName && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderName.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender Contact */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Contact Number*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0123456789"
                                    className={`input input-bordered w-full ${errors.senderContact ? "input-error" : ""}`}
                                    {...register("senderContact", {
                                        required: "Contact number is required",
                                        pattern: {
                                            //value: /^[0-9]{10,15}$/,
                                            message: "Please enter a valid phone number",
                                        },
                                    })}
                                />
                                {errors.senderContact && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderContact.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender Region */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Region*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.senderRegion ? "select-error" : ""}`}
                                    {...register("senderRegion", { required: "Region is required" })}
                                >
                                    <option value="">Select region</option>
                                    {uniqueRegions.map((region, index) => (
                                        <option key={index} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                                {errors.senderRegion && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderRegion.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender District */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">District*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.senderDistrict ? "select-error" : ""}`}
                                    disabled={!senderRegion}
                                    {...register("senderDistrict", { required: "District is required" })}
                                >
                                    <option value="">Select district</option>
                                    {senderDistricts.map((district, index) => (
                                        <option key={index} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                                {errors.senderDistrict && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderDistrict.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender City */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.senderCity ? "select-error" : ""}`}
                                    disabled={!senderDistrict}
                                    {...register("senderCity", { required: "City is required" })}
                                >
                                    <option value="">Select city</option>
                                    {senderCities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {errors.senderCity && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderCity.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender Area */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Covered Area*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.senderArea ? "select-error" : ""}`}
                                    disabled={!senderCity}
                                    {...register("senderArea", { required: "Area is required" })}
                                >
                                    <option value="">Select area</option>
                                    {senderAreas.map((area, index) => (
                                        <option key={index} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                                {errors.senderArea && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderArea.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Sender Address */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Full Address*</span>
                                </label>
                                <textarea
                                    placeholder="House/Road details"
                                    className={`textarea textarea-bordered w-full ${errors.senderAddress ? "textarea-error" : ""}`}
                                    {...register("senderAddress", { required: "Address is required" })}
                                ></textarea>
                                {errors.senderAddress && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.senderAddress.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Pickup Instructions */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Pickup Instructions*</span>
                                </label>
                                <textarea
                                    placeholder="Any special instructions for pickup"
                                    className={`textarea textarea-bordered w-full ${errors.pickupInstructions ? "textarea-error" : ""
                                        }`}
                                    {...register("pickupInstructions", { required: "Pickup instructions are required" })}
                                ></textarea>
                                {errors.pickupInstructions && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.pickupInstructions.message}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Receiver Information Section */}
                    <div className="card  w-full bg-base-200 p-6">
                        <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Receiver Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Receiver name"
                                    className={`input input-bordered w-full ${errors.receiverName ? "input-error" : ""}`}
                                    {...register("receiverName", { required: "Receiver name is required" })}
                                />
                                {errors.receiverName && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverName.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver Contact */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Contact Number*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="e.g. 0123456789"
                                    className={`input input-bordered w-full ${errors.receiverContact ? "input-error" : ""}`}
                                    {...register("receiverContact", {
                                        required: "Contact number is required",
                                        pattern: {
                                            // value: /^[0-9]{10,15}$/,
                                            message: "Please enter a valid phone number",
                                        },
                                    })}
                                />
                                {errors.receiverContact && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverContact.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver Region */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Region*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.receiverRegion ? "select-error" : ""}`}
                                    {...register("receiverRegion", { required: "Region is required" })}
                                >
                                    <option value="">Select region</option>
                                    {uniqueRegions.map((region, index) => (
                                        <option key={index} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                                {errors.receiverRegion && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverRegion.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver District */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">District*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.receiverDistrict ? "select-error" : ""}`}
                                    disabled={!receiverRegion}
                                    {...register("receiverDistrict", { required: "District is required" })}
                                >
                                    <option value="">Select district</option>
                                    {receiverDistricts.map((district, index) => (
                                        <option key={index} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                                {errors.receiverDistrict && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverDistrict.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver City */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.receiverCity ? "select-error" : ""}`}
                                    disabled={!receiverDistrict}
                                    {...register("receiverCity", { required: "City is required" })}
                                >
                                    <option value="">Select city</option>
                                    {receiverCities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                                {errors.receiverCity && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverCity.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver Area */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Covered Area*</span>
                                </label>
                                <select
                                    className={`select select-bordered w-full ${errors.receiverArea ? "select-error" : ""}`}
                                    disabled={!receiverCity}
                                    {...register("receiverArea", { required: "Area is required" })}
                                >
                                    <option value="">Select area</option>
                                    {receiverAreas.map((area, index) => (
                                        <option key={index} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                                {errors.receiverArea && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverArea.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Receiver Address */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Full Address*</span>
                                </label>
                                <textarea
                                    placeholder="House/Road details"
                                    className={`textarea textarea-bordered w-full ${errors.receiverAddress ? "textarea-error" : ""}`}
                                    {...register("receiverAddress", { required: "Address is required" })}
                                ></textarea>
                                {errors.receiverAddress && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.receiverAddress.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Delivery Instructions */}
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text">Delivery Instructions*</span>
                                </label>
                                <textarea
                                    placeholder="Any special instructions for delivery"
                                    className={`textarea textarea-bordered w-full ${errors.deliveryInstructions ? "textarea-error" : ""
                                        }`}
                                    {...register("deliveryInstructions", {
                                        required: "Delivery instructions are required",
                                    })}
                                ></textarea>
                                {errors.deliveryInstructions && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.deliveryInstructions.message}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Estimated Cost Display */}
                {deliveryCost > 0 && (
                    <div className="text-right text-lg font-semibold">
                        Estimated Delivery Cost: <span className="text-primary">${deliveryCost}</span>
                    </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary px-8">
                        Schedule Delivery
                    </button>
                </div>
            </form>
        </div>
    );
}
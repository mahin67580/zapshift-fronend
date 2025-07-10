//import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';
import { AuthContext } from '../../Provider/AuthContext';
import AxiosSequre from '../../hook/AxiosSequre';
import { FaTrash, FaEye, FaFileAlt, FaBoxOpen, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';


const Myparcels = () => {
    const { user } = use(AuthContext);
    const AxiosSecure = AxiosSequre();
    const navigate = useNavigate()
    //const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch parcels data TanStack
    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ["my_parcels", user?.email],
        queryFn: async () => {
            const res = await AxiosSecure.get(`/parcels/user/${user?.email}`);
            return res.data.data;
        },
        enabled: !!user?.email
    });
      console.log(parcels);
    // Delete parcel mutation
    // const deleteParcel = useMutation({
    //     mutationFn: (id) => AxiosSecure.delete(`/parcels/${id}`),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['my_parcels']); // refresh ui istant delete
    //         // toast.success('Parcel deleted successfully');
    //     },
    //     // onError: (error) => {
    //     //     toast.error('Failed to delete parcel');
    //     //     console.error('Delete error:', error);
    //     // }
    // });

    // Filter parcels based on search term
    const filteredParcels = parcels.filter(parcel => {
        const searchLower = searchTerm.toLowerCase();
        return (
            parcel.title.toLowerCase().includes(searchLower) ||
            parcel.parcelType.toLowerCase().includes(searchLower) ||
            parcel.tracking_id.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleView = (parcel) => {
        setSelectedParcel(parcel);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {

            try {
                AxiosSecure.delete(`/parcels/${id}`)
                    .then(res => {
                        console.log(res);
                        if (res.data.success) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                        refetch()
                    })
            } catch (err) {
                Swal.fire(
                    'Error!', err.message || 'Failed to delete parcel.', 'error'
                );
            }


            // deleteParcel.mutate(id, {
            //     onSuccess: () => {
            //         Swal.fire(
            //             'Deleted!',
            //             'Your parcel has been deleted.',
            //             'success'
            //         );
            //     },
            //     onError: () => {
            //         Swal.fire(
            //             'Error!',
            //             'Failed to delete parcel.',
            //             'error'
            //         );
            //     }
            // });
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedParcel(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    const handlepay = (id) => {
        navigate(`/dashboard/payment/${id}`)
    }
    return (
        <div className="min-h-screen p-4 bg-base-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        My Parcels <span className="text-primary">({parcels.length})</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by title, type or tracking ID..."
                            className="input input-bordered input-sm w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Link to={'/sendparcel'}>
                            <button className="btn btn-primary btn-sm w-40">
                                Create New Parcel
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden space-y-4">
                    {filteredParcels.length === 0 ? (
                        <div className="card bg-base-200">
                            <div className="card-body items-center text-center py-12">
                                <FaBoxOpen className="text-5xl text-gray-400" />
                                <p className="text-lg font-medium mt-2">
                                    {searchTerm ? 'No matching parcels found' : 'No parcels found'}
                                </p>
                                <Link to={'/sendparcel'}>
                                    <button className="btn btn-primary btn-sm mt-4">
                                        Create New Parcel
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        filteredParcels.map((parcel) => (
                            <div key={parcel._id} className="card bg-base-100 border border-base-200">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                {parcel.parcelType === 'document' ? (
                                                    <FaFileAlt className="text-blue-500" />
                                                ) : (
                                                    <FaBoxOpen className="text-green-500" />
                                                )}
                                                <span className="font-medium">{parcel.title}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(parcel.creation_date)}
                                            </div>
                                            <div className="text-sm mt-1">
                                                <span className="font-medium">Cost: </span>
                                                ৳ {parcel.cost}
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <button
                                                onClick={() => handleView(parcel)}
                                                className="btn       btn-square "
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(parcel._id)}
                                                className="btn     btn-square"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-3">
                                        <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>
                                            {parcel.payment_status}
                                        </span>
                                        <span className={`badge ${parcel.delivery_status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                                            {parcel.delivery_status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-base-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-base-200">
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Cost</th>
                                    <th>Created At</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParcels.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                                                <FaBoxOpen className="text-5xl" />
                                                <p className="text-lg font-medium">
                                                    {searchTerm ? 'No matching parcels found' : 'No parcels found'}
                                                </p>
                                                <Link to={'/sendparcel'}>
                                                    <button className="btn btn-primary btn-sm mt-2">
                                                        Create New Parcel
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredParcels.map((parcel) => (
                                        <tr key={parcel._id} className="hover:bg-base-200">
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    {parcel.parcelType === 'document' ? (
                                                        <FaFileAlt className="text-blue-500" />
                                                    ) : (
                                                        <FaBoxOpen className="text-green-500" />
                                                    )}
                                                    <span className="capitalize">{parcel.parcelType}</span>
                                                </div>
                                            </td>
                                            <td className="font-medium">{parcel.title}</td>
                                            <td>৳ {parcel.cost}</td>
                                            <td>{formatDate(parcel.creation_date)}</td>
                                            <td>
                                                <span className={`badge ${parcel.payment_status === 'paid' ? 'badge-success' : 'badge-error'}`}>
                                                    {parcel.payment_status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${parcel.delivery_status === 'delivered' ? 'badge-success' : 'badge-warning'}`}>
                                                    {parcel.delivery_status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="flex gap-2 items-center">
                                                    <button
                                                        onClick={() => handleView(parcel)}
                                                        className="btn btn-ghost btn-xs btn-square"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(parcel._id)}
                                                        className="btn btn-ghost btn-xs btn-square"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    {
                                                        parcel.payment_status === 'paid' ? <>  <button className='btn bg-green-400'> Payed</button></> : <>  <button onClick={() => { handlepay(parcel._id) }} className='btn bg-red-400'> Pay</button></>
                                                    }


                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Parcel Details Modal */}
            {isModalOpen && selectedParcel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">Parcel Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-sm btn-circle btn-ghost"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Sender Information</h4>
                                    <p><span className="font-medium">Name:</span> {selectedParcel.senderName}</p>
                                    <p><span className="font-medium">Contact:</span> {selectedParcel.senderContact}</p>
                                    <p><span className="font-medium">Address:</span> {selectedParcel.senderAddress}, {selectedParcel.senderArea}, {selectedParcel.senderCity}</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold">Receiver Information</h4>
                                    <p><span className="font-medium">Name:</span> {selectedParcel.receiverName}</p>
                                    <p><span className="font-medium">Contact:</span> {selectedParcel.receiverContact}</p>
                                    <p><span className="font-medium">Address:</span> {selectedParcel.receiverAddress}, {selectedParcel.receiverArea}, {selectedParcel.receiverCity}</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <h4 className="font-semibold">Parcel Information</h4>
                                <p><span className="font-medium">Tracking ID:</span> {selectedParcel.tracking_id}</p>
                                <p><span className="font-medium">Title:</span> {selectedParcel.title}</p>
                                <p><span className="font-medium">Type:</span> {selectedParcel.parcelType}</p>
                                <p><span className="font-medium">Cost:</span> ${selectedParcel.cost}</p>
                                <p><span className="font-medium">Status:</span>
                                    <span className={`ml-2 badge ${selectedParcel.delivery_status === 'delivered'
                                        ? 'badge-success'
                                        : 'badge-warning'
                                        }`}>
                                        {selectedParcel.delivery_status}
                                    </span>
                                </p>
                                <p><span className="font-medium">Payment:</span>
                                    <span className={`ml-2 badge ${selectedParcel.payment_status === 'paid'
                                        ? 'badge-success'
                                        : 'badge-error'
                                        }`}>
                                        {selectedParcel.payment_status}
                                    </span>
                                </p>
                                <p><span className="font-medium">Created:</span> {formatDate(selectedParcel.creation_date)}</p>
                                {selectedParcel.pickupInstructions && (
                                    <p><span className="font-medium">Pickup Instructions:</span> {selectedParcel.pickupInstructions}</p>
                                )}
                                {selectedParcel.deliveryInstructions && (
                                    <p><span className="font-medium">Delivery Instructions:</span> {selectedParcel.deliveryInstructions}</p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="btn btn-primary"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Myparcels;
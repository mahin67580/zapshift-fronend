import React, { use, useEffect } from 'react';
import { AuthContext } from '../Provider/AuthContext';

import Swal from 'sweetalert2';

const MyProfile = () => {
    useEffect(() => {
        document.title = 'My Profile';
        window.scrollTo(0, 0);
    }, []);

    const { user, setUser, updateUser } = use(AuthContext);

    const manualUpdate = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photo = form.photo.value;
        updateUser({ displayName: name, photoURL: photo })
            .then(() => {
                setUser({ ...user, displayName: name, photoURL: photo });
                form.reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            });
    };

    return (

        <div className="container   mx-auto px-4 py-8">
            {/* Profile Card */}
            <div className="flex flex-col lg:flex-row justify-center lg:gap-20 items-center">
                <div className="w-full max-w-md bg-base-200 rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col items-center">
                        <img
                            src={user?.photoURL}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                        />
                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-bold">{user?.displayName}</h2>
                            <p className="text-base-content/80">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Update Form */}
                <div className="w-full max-w-md bg-base-200 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-center mb-4">Update Profile</h2>
                    <form onSubmit={manualUpdate} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Your Name"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Photo URL</span>
                            </label>
                            <input
                                name="photo"
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Photo URL"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4">
                            Update Profile
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default MyProfile;

import React, { use, useEffect, useState } from 'react';
import { AuthContext } from '../Provider/AuthContext';
import { Link, useNavigate } from 'react-router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase/firebase.config';
import Swal from 'sweetalert2';
import Loading from '../component/Loading';
import axios from 'axios';
import UseAxios from '../hook/UseAxios';

const Register = () => {

    useEffect(() => {
        document.title = 'Register';
        window.scrollTo(0, 0);
    }, []);


    const provider = new GoogleAuthProvider();

    const { createUser, setUser, updateUser, loading } = use(AuthContext)
    const [nameError, setNameError] = useState('')
    const [passError, setPassError] = useState('')
    const [profilePic, setProfilePic] = useState('')
    const axiosInstance = UseAxios()
    const navigate = useNavigate()

    const handleregister = (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        if (name.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Name should be more then 5 character!",

            });
            // setNameError("Name should be more then 5 character")
            return;
        }
        else {
            setNameError("")
        }

        const email = form.email.value;
        const password = form.password.value;
        if (password.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "password should be more then 5 character!",

            });
            //setPassError("password should be more then 5 character")
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password must contain at least one uppercase letter!",

            });
            //setPassError("Password must contain at least one uppercase letter");
            return;
        } else if (!/[a-z]/.test(password)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Password must contain at least one lowercase letter!",

            });
            //setPassError("Password must contain at least one lowercase letter");
            return;
        }
        else {
            setPassError("")
        }
        createUser(email, password)
            .then(async (userCredential) => {

                const user = userCredential.user;

                //update userinfo in database 
                const userinfo = {
                    email,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users', userinfo)
                console.log(userRes.data);



                //update user profile in firebase
                updateUser({ displayName: name, photoURL: profilePic })
                    .then(() => {
                        if (loading) {
                            return <Loading></Loading>
                        }
                        navigate('/')
                        setUser({ ...user, displayName: name, photoURL: profilePic });
                        console.log('done');

                    }).catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: `"Oops..."${error}`,
                            text: "Something went wrong!",

                        });
                    });



            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    icon: "error",
                    title: ` "Oops..." ${errorMessage}`,
                    text: "Something went wrong!",

                });

                // ..
            });

    }

    const handlegooglelogin = () => {

        signInWithPopup(auth, provider).then(() => {
            navigate('/')

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Login successful! welcome ",
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(error => {
            Swal.fire({
                icon: "error",
                title: ` "Oops..." ${error}`,
                text: "Something went wrong!",

            });

        })

    }

    // const handleImage = async (e) => {
    //     const image = e.target.files[0]
    //     // console.log(image);

    //     const formData = new FormData()
    //     formData.append('image', image)
    //     const imageUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_KEY}`
    //     const res = await axios.post(imageUrl, formData)
    //     //setProfilePic(res.data.data.url);
    //     console.log(res.data);

    // }
    // using cloudinary
    const handleImage = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "unsigned_upload"); // your preset name
        formData.append("cloud_name", "dkz7tuihl"); // your cloud name

        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dkz7tuihl/image/upload",
                formData
            );

            console.log("Image uploaded:", res.data.secure_url);
            setProfilePic(res.data.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };






    return (
        <div>
            <div className='flex justify-center min-h-screen items-center'>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <form onSubmit={handleregister} className="fieldset">
                            <h1 className='text-center text-2xl font-semibold'>Register Your Account</h1>

                            <label className="label">Name</label>
                            <input name='name' type="text" className="input" placeholder="Name" />
                            {
                                nameError && <p className=' text-red-600'>{nameError}</p>
                            }
                            <label className="label">Profile image</label>
                            <input name='image' type="file" onChange={handleImage} className=" " placeholder="image" />



                            <label className="label">Email</label>
                            <input name='email' type="email" className="input" placeholder="Email" />

                            <label className="label">Password</label>
                            <input name='password' type="password" className="input" placeholder="Password" />
                            {
                                passError && <p className=' text-red-600'>{passError}</p>
                            }


                            <button type='submit' className="btn btn-neutral mt-4">Register</button>

                            <p className='mt-3 text-center'>Already Have an account?<Link className='text-green-800 text-xl font-bold' to={'/login'}> Login now!</Link></p>

                            <p className='text-center font-semibold'>or</p>

                            <button onClick={handlegooglelogin} className='btn btn-primary'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                            </svg> Login With Google</button>
                        </form >
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
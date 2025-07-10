
import React, { use, useEffect } from 'react';
import { AuthContext } from '../Provider/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../Firebase/firebase.config';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const Login = () => {



    useEffect(() => {
        document.title = 'Login';
        window.scrollTo(0, 0);
    }, []);


    const provider = new GoogleAuthProvider();

    const { login } = use(AuthContext)
    const location = useLocation();
    const navigate = useNavigate()
    // console.log(location);

    const handlelogin = (e) => {

        e.preventDefault();
        const form = e.target;
        const email = form.email.value
        const password = form.password.value
        // console.log(email, password);

        login(email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                //console.log(user);

                navigate(`${location.state ? location.state : '/'}`)


                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `"Log in successful",welcome ${user.displayName}`,
                    showConfirmButton: false,
                    timer: 1000
                });

                form.reset();
            })
            .catch((error) => {
                //(error as param)
                // const errorCode = error.code;
                const errorMessage = error.message;

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: ` ${errorMessage}`,

                });

            });

    }


    const handlegooglelogin = () => {

        signInWithPopup(auth, provider).then(() => {
            navigate(`${location.state ? location.state : '/'}`)

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Logged in successful",
                showConfirmButton: false,
                timer: 1000
            });
        }).catch(error => {

            Swal.fire({
                icon: "error",
                title: `"Oops...${error}"`,
                text: "Something went wrong!",

            });

        })

    }


    return (
        <div>
            <form onSubmit={handlelogin} className='flex justify-center min-h-screen items-center'>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <h1 className='text-center text-2xl font-semibold'>Login To Your Account</h1>

                            <label className="label">Email</label>
                            <input name='email' type="email" className="input" placeholder="Email" required />

                            <label className="label">Password</label>
                            <input name='password' type="password" className="input" placeholder="Password" required />

                            {/* {
                                <Link to={'/auth/login/resetpassword'}>
                                    <div><p className="link link-hover font-semibold">Forgot password?</p></div>
                                </Link>
                            } */}

                            <button className="btn btn-neutral mt-4">Login</button>


                            <button onClick={handlegooglelogin} className='btn btn-primary'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                                <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                            </svg> Login With Google</button>


                            <p className='mt-3 text-center'>Don't Have an account?<Link className='text-green-800 text-xl font-bold ' to={'/register'}> Register now!</Link></p>
                        </fieldset>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
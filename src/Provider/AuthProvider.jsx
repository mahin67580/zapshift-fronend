import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Firebase/firebase.config';
import Swal from 'sweetalert2';

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    
    const [loading, setLoading] = useState(true);



    const createUser = (email, password) => {
         
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Registration successful",
            showConfirmButton: false,
            timer: 1500
        });
        setLoading(true)

        return createUserWithEmailAndPassword(auth, email, password)

    }

    const logout = () => {
        return signOut(auth)
    }

    const login = (email, password) => {

        return signInWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (updatedData) => {

        return updateProfile(auth.currentUser, updatedData)

    }

    useEffect(() => {
        const unsbscribe = onAuthStateChanged(auth, (CurrentUser) => {
            setUser(CurrentUser);
            setLoading(false)
            console.log("user" ,CurrentUser);

        });
        return () => {
            unsbscribe();
        }
    }, [])


    const authdata = {
        user,
        setUser,
        createUser,
        logout,
        login,
        updateUser,
        loading,
        setLoading,
    }

    return (
        <AuthContext value={authdata}>{children}</AuthContext>
    );
};

export default AuthProvider;
import React from 'react';
import { Outlet } from 'react-router';

const Authlayout = () => {
    return (
        <div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Authlayout;
import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router';
import { FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false); // Close mobile menu when resizing to large screen
            }
        };

        // Initial check
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navLinks = [
        { path: '/dashboard/stats', name: 'Dashboard' },
        { path: '/dashboard/profile', name: 'Profile' },
        { path: '/dashboard/mypacels', name: 'My Parcels' },
        { path: '/dashboard/paymentHistory', name: 'Hisstoy' },
        { path: '/dashboard/reports', name: 'Reports' },
    ];

    return (
        <div className="min-h-screen bg-base-200">
            {/* Mobile Header */}
            <div className="lg:hidden navbar bg-base-100 shadow-sm">
                <div className="flex-none">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Dashboard</a>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar - Desktop */}
                {isLargeScreen && (
                    <div className="w-64 min-h-screen bg-base-100 shadow-md">
                        <div className="p-4 border-b border-base-200">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <ul className="menu p-4 ">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    {/* <a href={link.path} className="active:bg-amber-100">
                                        {link.name}
                                    </a> */}
                                    <NavLink to={link.path}>
                                        {link.name}
                                    </NavLink>

                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Mobile Sidebar */}
                {!isLargeScreen && isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0   bg-opacity-50"
                            onClick={toggleMobileMenu}
                        ></div>
                        {/* Sidebar */}
                        <div className="relative z-50 w-64 min-h-screen bg-base-100 shadow-lg">
                            <div className="p-4 border-b border-base-200 flex justify-between items-center">
                                <h1 className="text-xl font-semibold">Dashboard</h1>
                                <button onClick={toggleMobileMenu} className="btn btn-sm btn-circle">
                                    <FiX size={18} />
                                </button>
                            </div>
                            <ul className="menu p-4">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <NavLink to={link.path}>
                                            {link.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
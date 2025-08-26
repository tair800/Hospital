import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import AdminHeader from './AdminHeader'
import './AdminLayout.css'

function AdminLayout() {
    const location = useLocation();

    // Get the title based on the current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/admin':
                return 'Dashboard';
            case '/admin/home':
                return 'Əsas səhifə';
            case '/admin/about':
                return 'About us';
            case '/admin/members':
                return 'Üzvlər';
            case '/admin/events':
                return 'Tədbirlər';
            case '/admin/sponsors':
                return 'Sponsors';
            case '/admin/contact':
                return 'Contact';
            case '/admin/blog':
                return 'Blog';
            case '/admin/gallery':
                return 'Gallery';
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-main-content">
                <AdminHeader title={getPageTitle()} />
                <div className="admin-page-content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AdminLayout

import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminHeader.css'
const adminGlobe = '/assets/admin-globe.png'
const adminSettings = '/assets/admin-settings.png'
const adminUser = '/assets/admin-user.png'

function AdminHeader({ title = "Dashboard" }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated')
        navigate('/admin/login')
    }
    return (
        <div className="admin-header">
            <div className="admin-header-left">
                <h1 className="admin-header-title">{title}</h1>
            </div>
            <div className="admin-header-right">
                <div className="admin-header-icons">
                    <button className="admin-header-icon-btn">
                        <img src={adminGlobe} alt="Globe" className="admin-icon" />
                    </button>
                    <button className="admin-header-icon-btn">
                        <img src={adminSettings} alt="Settings" className="admin-icon" />
                    </button>
                    <button className="admin-header-icon-btn profile logout-btn" onClick={handleLogout} title="Logout">
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader

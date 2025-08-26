import React from 'react'
import './AdminHeader.css'
import adminGlobe from '../../assets/admin-globe.png'
import adminSettings from '../../assets/admin-settings.png'
import adminUser from '../../assets/admin-user.png'

function AdminHeader({ title = "Dashboard" }) {
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
                    <button className="admin-header-icon-btn profile">
                        <img src={adminUser} alt="User" className="admin-icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader

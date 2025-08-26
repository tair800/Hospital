import React from 'react'
import './Dashboard.css'

function Dashboard() {
    return (
        <div className="admin-content">
            <div className="content-body">
                <div className="welcome-message">
                    <p>Welcome to the hospital administration panel</p>
                </div>
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Total Patients</h3>
                        <p className="stat-number">1,234</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Doctors</h3>
                        <p className="stat-number">89</p>
                    </div>
                    <div className="stat-card">
                        <h3>Appointments Today</h3>
                        <p className="stat-number">45</p>
                    </div>
                    <div className="stat-card">
                        <h3>Departments</h3>
                        <p className="stat-number">12</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard



import React, { useState, useEffect } from 'react'
import { getImagePath } from '../../utils/imageUtils'
import './Dashboard.css'

function Dashboard() {
    const [upcomingEventsCount, setUpcomingEventsCount] = useState(0);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [membersLoading, setMembersLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingEventsCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events/upcoming/count');
                if (response.ok) {
                    const count = await response.json();
                    setUpcomingEventsCount(count);
                } else {
                    console.error('Failed to fetch upcoming events count');
                    // Fallback: try to get all events and count upcoming ones
                    await fetchUpcomingEventsFallback();
                }
            } catch (error) {
                console.error('Error fetching upcoming events count:', error);
                // Fallback: try to get all events and count upcoming ones
                await fetchUpcomingEventsFallback();
            } finally {
                setLoading(false);
            }
        };

        const fetchUpcomingEventsFallback = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if (response.ok) {
                    const events = await response.json();
                    const now = new Date();
                    const upcomingCount = events.filter(event => new Date(event.eventDate) > now).length;
                    setUpcomingEventsCount(upcomingCount);
                } else {
                    // If API is completely unavailable, show a default value
                    setUpcomingEventsCount(0);
                }
            } catch (error) {
                console.error('Error in fallback fetch:', error);
                setUpcomingEventsCount(0);
            }
        };

        const fetchUpcomingEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events/upcoming');
                if (response.ok) {
                    const events = await response.json();
                    // Take only the first 5 upcoming events
                    setUpcomingEvents(events.slice(0, 5));
                } else {
                    console.error('Failed to fetch upcoming events');
                }
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            } finally {
                setSessionsLoading(false);
            }
        };

        const fetchRecentEmployees = async () => {
            try {
                // First try the recent endpoint
                let response = await fetch('http://localhost:5000/api/employees/recent');
                if (response.ok) {
                    const employees = await response.json();
                    setRecentEmployees(employees);
                } else {
                    // Fallback to regular employees endpoint and filter recent ones
                    console.log('Recent endpoint failed, trying regular employees endpoint');
                    response = await fetch('http://localhost:5000/api/employees');
                    if (response.ok) {
                        const allEmployees = await response.json();
                        // Sort by createdAt and take the first 5
                        const recent = allEmployees
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .slice(0, 5);
                        setRecentEmployees(recent);
                    } else {
                        console.error('Failed to fetch employees');
                    }
                }
            } catch (error) {
                console.error('Error fetching recent employees:', error);
            } finally {
                setMembersLoading(false);
            }
        };

        fetchUpcomingEventsCount();
        fetchUpcomingEvents();
        fetchRecentEmployees();
    }, []);

    return (
        <div className="admin-content">
            <div className="content-body">
                <div className="dashboard-cards">
                    <div className="dashboard-card">
                        <div className="card-content">
                            <div className="card-main">
                                <h2 className="card-number">450</h2>
                                <p className="card-description">Total Members</p>
                            </div>
                            <div className="card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-content">
                            <div className="card-main">
                                <h2 className="card-number">
                                    {loading ? '...' : upcomingEventsCount}
                                </h2>
                                <p className="card-description">Aktiv tədbirlər</p>
                            </div>
                            <div className="card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    <line x1="12" y1="14" x2="12" y2="18"></line>
                                    <line x1="10" y1="16" x2="14" y2="16"></line>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-content">
                            <div className="card-main">
                                <h2 className="card-number">₼1450</h2>
                                <p className="card-description">Tədbirlərdən gələn gəlir</p>
                            </div>
                            <div className="card-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                    <polyline points="17 6 23 6 23 12"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="dashboard-content">
                    <div className="chart-container">
                        <h3 className="chart-title">Event Attendance Trend</h3>
                        <div className="chart-wrapper">
                            <svg className="attendance-chart" viewBox="0 0 600 300">
                                {/* Grid lines */}
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Y-axis labels */}
                                <text x="30" y="20" className="axis-label">800</text>
                                <text x="30" y="60" className="axis-label">600</text>
                                <text x="30" y="100" className="axis-label">400</text>
                                <text x="30" y="140" className="axis-label">200</text>
                                <text x="30" y="180" className="axis-label">0</text>

                                {/* X-axis labels */}
                                <text x="100" y="200" className="axis-label">Jul</text>
                                <text x="160" y="200" className="axis-label">Aug</text>
                                <text x="220" y="200" className="axis-label">Sep</text>
                                <text x="280" y="200" className="axis-label">Oct</text>
                                <text x="340" y="200" className="axis-label">Nov</text>
                                <text x="400" y="200" className="axis-label">Dec</text>
                                <text x="460" y="200" className="axis-label">Jan</text>

                                {/* Area chart path */}
                                <path
                                    d="M 100 180 L 160 120 L 220 100 L 280 20 L 340 160 L 400 40 L 460 60 L 500 60 L 500 200 L 100 200 Z"
                                    fill="rgba(59, 130, 246, 0.2)"
                                    className="area-fill"
                                />

                                {/* Line chart path */}
                                <path
                                    d="M 100 180 L 160 120 L 220 100 L 280 20 L 340 160 L 400 40 L 460 60"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    className="trend-line"
                                />

                                {/* Data points */}
                                <circle cx="100" cy="180" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="160" cy="120" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="220" cy="100" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="280" cy="20" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="340" cy="160" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="400" cy="40" r="4" fill="#3b82f6" className="data-point" />
                                <circle cx="460" cy="60" r="4" fill="#3b82f6" className="data-point" />
                            </svg>
                        </div>
                    </div>

                    <div className="sessions-container">
                        <h3 className="sessions-title">Upcoming Sessions</h3>
                        <div className="sessions-table-wrapper">
                            <table className="sessions-table">
                                <thead>
                                    <tr>
                                        <th className="table-header event-name">Event's Name</th>
                                        <th className="table-header date">Date</th>
                                        <th className="table-header participants">Participants</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionsLoading ? (
                                        <tr className="table-row">
                                            <td className="table-cell event-name" colSpan="3" style={{ textAlign: 'center' }}>
                                                Loading upcoming events...
                                            </td>
                                        </tr>
                                    ) : upcomingEvents.length > 0 ? (
                                        upcomingEvents.map((event, index) => (
                                            <tr key={event.id || index} className="table-row">
                                                <td className="table-cell event-name">{event.title}</td>
                                                <td className="table-cell date">
                                                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="table-cell participants">
                                                    {event.participants || 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="table-row">
                                            <td className="table-cell event-name" colSpan="3" style={{ textAlign: 'center' }}>
                                                No upcoming events found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="recent-members-container">
                    <h3 className="recent-members-title">Recent Members</h3>
                    <div className="members-list">
                        {membersLoading ? (
                            <div className="member-item">
                                <div className="member-info" style={{ textAlign: 'center', width: '100%' }}>
                                    <p>Loading recent employees...</p>
                                </div>
                            </div>
                        ) : recentEmployees.length > 0 ? (
                            recentEmployees.map((employee, index) => (
                                <div key={employee.id || index} className="member-item">
                                    <div className="member-avatar">
                                        <img
                                            src={getImagePath(employee.image) || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face"}
                                            alt={employee.fullname}
                                            onError={(e) => {
                                                // Fallback to Unsplash if the image fails to load
                                                e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=60&h=60&fit=crop&crop=face";
                                            }}
                                        />
                                    </div>
                                    <div className="member-info">
                                        <h4 className="member-name">{employee.fullname}</h4>
                                        <p className="member-profession">{employee.field}</p>
                                    </div>
                                    <div className="member-status">
                                        <span className="new-badge">New</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="member-item">
                                <div className="member-info" style={{ textAlign: 'center', width: '100%' }}>
                                    <p>No recent employees found</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard



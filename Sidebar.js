import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close sidebar when a link is clicked
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div>
            {/* Only show open button if sidebar is closed */}
            {!sidebarOpen && (
                <button className="toggle-btn" onClick={toggleSidebar}>
                    Open Menu
                </button>
            )}

            {/* Sidebar content */}
            {sidebarOpen && (
                <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <button className="toggle-btn close-btn" onClick={toggleSidebar}>
                        Close Menu
                    </button>
                    <ul className="sidebar-menu">
                        <li className="sidebar-item">
                            {/* Close sidebar when link is clicked */}
                            <Link to="/" onClick={closeSidebar}>Home</Link>
                        </li>
                        <li className="sidebar-item">
                            Options <span>▼</span>
                            <ul className="dropdown">
                                <li><Link to="/explore" onClick={closeSidebar}>Explore</Link></li>
                                <li><Link to="/upload" onClick={closeSidebar}>Upload</Link></li>
                                <li><Link to="/profile" onClick={closeSidebar}>Profile</Link></li>
                            </ul>
                        </li>
                        <li className="sidebar-item">
                            <Link to="/library" onClick={closeSidebar}>Library</Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Sidebar;


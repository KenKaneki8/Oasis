import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                {/* You can keep the Home link if you want, or remove all for a cleaner look */}
                <li><Link to="/">Home</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;

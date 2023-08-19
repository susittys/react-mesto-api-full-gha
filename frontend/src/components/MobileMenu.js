import React from 'react';
import { NavLink } from 'react-router-dom';

function MobileMenu({isOpen, logOut, email}) {
    return (
        <div className={`mobile-menu ${isOpen && 'mobile-menu_open'}`}>
            <p className="menu__email">{email}</p>
            <NavLink onClick={logOut} className="menu__nav" to="/sign-in">Выйти</NavLink>
        </div>
    );
}

export default MobileMenu;
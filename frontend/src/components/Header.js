import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../images/logo/logo_white.svg';

function Header(props) {
    return (
        <header className="header">
            <nav className="menu">
                <NavLink to="/">
                    <img className="header__logo" alt="Логотип Места России" src={logo} />
                </NavLink>
                {props.content}
            </nav>
        </header>
    );
}

export default Header;
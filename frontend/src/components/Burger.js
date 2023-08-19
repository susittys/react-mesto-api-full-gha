import React from "react";
import iconMenu from '../images/burger.svg';
import iconX from '../images/burger-x.svg';

function Burger({isOpen, onBurger}) {
    return (
        <div className='menu__burger' onClick={onBurger}>
            <input id="burger-btn" className="burger" type="checkbox" onClick={event => event.stopPropagation()}></input>
            <label htmlFor="burger-btn" className="burger__cover">
                <img src={isOpen ? iconX : iconMenu} alt="Иконка меню"/>
            </label>
        </div>
    )
}
export default Burger
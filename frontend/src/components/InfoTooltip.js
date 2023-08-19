import React from 'react';
import Popup from "./Popup";

function InfoTooltip({ name, options, isOpen, onClose }) {
    return (
        <Popup isOpen={isOpen} name={name} onClose={onClose}>
            <div className="popup__form popup__form_type_confirm">
                <img className="popup__icon" src={options.statusIcon} alt="Предупреждающая иконка Внимание"/>
                <h2 className="popup__title popup__title_type_confirm">{options.text || ''}</h2>
            </div>
        </Popup>
    );
}

export default InfoTooltip;
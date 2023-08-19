import React from 'react';
import Popup from "./Popup";

function PopupWithForm({ name, title, isOpen, onSubmit, onClose, submitText, children }) {
    return (
        <Popup isOpen={isOpen} name={name} onClose={onClose}>
            <div className="popup__form">
                <h2 className='popup__title'>{title}</h2>
                {children}
                <button type="submit" onClick={onSubmit} className="popup__submit">{submitText}</button>
            </div>
        </Popup>
    );
}

export default PopupWithForm;
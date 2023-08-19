import loading from '../images/image_loading.gif';
import Popup from "./Popup";
import React from "react";
// import error from '../images/image_no-places.jpg';

function ImagePopup({onClose, card}) {
    return (
        <Popup isOpen={card.link} name="_image" onClose={onClose}>
            <div className="popup__form_type_image">
                <img className="popup__full-image"
                     alt="Изображение карточки"
                     src={card.link ? card.link : loading}
                />
                <p className="popup__subtitle-image">{card.name}</p>
            </div>
        </Popup>
    );
}

export default ImagePopup;
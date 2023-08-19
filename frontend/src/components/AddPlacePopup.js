import PopupWithForm from "./PopupWithForm";
import React from "react";
import {useForm} from "../hooks/useForm"
// import {useFormAndValidation} from "../hooks/useFormAndValidation";

function AddPlacePopup({isOpen, onAddPlace, onClose}) {
    const {values, setValues, handleChange} = useForm({name: '', link: ''});
    const {name, link} = values;


    React.useEffect( () => {
        setValues({name: '', link: ''});
    }, [isOpen] );


    function handleSubmit(e) {
        e.preventDefault();

        onAddPlace({
            name,
            link
        });
    }
    // popup__error_visible
    return (
        <PopupWithForm title="Новое место" submitText="Добавить" name="place" isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose}>
            <div className="popup__row">
                <input name="name" value={name || ''} onChange={handleChange} className="popup__input popup__input_type_title" id="place-title-input" type="text" placeholder="Введите название" minLength="2" maxLength="30" autoComplete="off" required />
                <span className="popup__error place-title-input-error">Вы пропустили это поле</span>
            </div>
            <div className="popup__row">
                <input name="link" value={link || ''} onChange={handleChange} className="popup__input popup__input_type_link" id="place-link-input" type="url" placeholder="Укажите ссылку" minLength="4" maxLength="2083" autoComplete="off" required />
                <span className="popup__error place-link-input-error">Введите адрес сайта</span>
            </div>
        </PopupWithForm>
    )
}

export default AddPlacePopup;
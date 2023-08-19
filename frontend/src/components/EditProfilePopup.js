import React from "react";

import { CurrentUserContext } from '../contexts/CurrentUserContext';

import PopupWithForm from "./PopupWithForm";

import {useForm} from "../hooks/useForm";

function EditProfilePopup({isOpen, onUpdateUser, onClose}) {
    const {values, setValues, handleChange} = useForm({name: '', job: ''});
    const {name, job} = values;

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        setValues({
            name: currentUser.userName,
            job: currentUser.userDescr
        })
    }, [currentUser,isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateUser({
            name,
            job
        });
    }

    return (
        <PopupWithForm title="Редактировать профиль"  submitText="Сохранить" name="profile" isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose}>
            <div className="popup__row">
                <input name="name" value={name || ''} onChange={handleChange} className="popup__input popup__input_type_name" id="profile-name-input" type="text"
                       placeholder="Введите имя" minLength="2" maxLength="40" autoComplete="off" required />
                <span className="popup__error profile-name-input-error">Вы пропустили это поле</span>
            </div>
            <div className="popup__row">
                <input name="job" value={job || ''} onChange={handleChange} className="popup__input popup__input_type_job" id="profile-job-input" type="text"
                       placeholder="Введите профессию" minLength="2" maxLength="200" autoComplete="off" required />
                <span className="popup__error profile-job-input-error">Вы пропустили это поле</span>
            </div>
        </PopupWithForm>
    );
}

export default EditProfilePopup;
import PopupWithForm from "./PopupWithForm";
import React, {useRef} from "react";

function EditAvatarPopup({isOpen, onUpdateAvatar, onClose}) {
    const avatarInput = useRef('');

    React.useEffect( () => {
        avatarInput['current']['value'] = ''
    }, [isOpen] );

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: avatarInput.current.value,
        })
    }

    return (
        <PopupWithForm title="Обновить аватар" submitText="Обновить" name="avatar" isOpen={isOpen} onSubmit={handleSubmit} onClose={onClose}>
            <div className="popup__row">
                <input name="avatar" ref={avatarInput} className="popup__input popup__input_type_link" id="avatar-link-input" type="url"
                       placeholder="Укажите ссылку" minLength="4" maxLength="2083" autoComplete="off" required />
                <span className="popup__error avatar-link-input-error">Введите ссылку</span>
            </div>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;
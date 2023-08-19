import React from 'react';
import loading from '../images/image_loading.gif';
import Card from "./Card";

import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({ cards, onAddPlace, onEditProfile, onEditAvatar, onCardClick, onCardLike, onCardDelete }) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main>
            <section className="profile">
                <div className="profile__avatar-group">
                    <button className="profile__avatar-mask" onClick={onEditAvatar}></button>
                    <img className="profile__ava" alt="Аватар Профиля" src={currentUser.userAvatar || loading} />
                </div>
                <div className="profile__info">
                    <h1 className="profile__name">{currentUser.userName}</h1>
                    <button type="button" className="profile__edit" onClick={onEditProfile}></button>
                    <p className="profile__job">{currentUser.userDescr}</p>
                </div>
                <button type="button" className="profile__add" onClick={onAddPlace}></button>
            </section>

            <section className="elements">
                <ul className="elements__collection">
                    {
                        cards.map( card => (
                            <Card key={card._id} card={card} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
                        ))
                    }
                </ul>
                <h2 className="elements__no-places" hidden>Нет добавленных карточек</h2>
            </section>
        </main>
    );
}

export default Main;
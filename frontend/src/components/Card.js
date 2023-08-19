import React from "react";

import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
    const { card } = props;

    const currentUser = React.useContext(CurrentUserContext);

    const isOwn = card.owner._id === currentUser.userID;

    const isLiked = card.likes.some(i => i._id === currentUser.userID);

    const cardLikeButtonClassName = (
        `elements__like ${isLiked && 'elements__like_active'}`
    );

    const handleClick = () => props.onCardClick(card);
    const handleLikeClick = () => props.onCardLike(card);
    const handleDeleteClick = () => props.onCardDelete(card);

    return (
        <li className="elements__element">
            {isOwn && <button type="button" className="elements__remove" onClick={handleDeleteClick} />}
            <div className="elements__image-group" onClick={handleClick}>
                <div className="elements__image-mask"></div>
                <img className="elements__image"
                     src={ card.link }
                     alt="Изображение карточки" />
            </div>
            <div className="elements__info-group">
                <h2 className="elements__title">{ card.name }</h2>
                <div className="elements__like-conteiner">
                    <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <p className="elements__like-counter">{ card.likes.length }</p>
                </div>
            </div>
        </li>
    )
}
export default Card
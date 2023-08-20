import React from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '../blocks/app/App.css';
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Main from './Main';
import Footer from './Footer';

import ProtectedRoute from "./ProtectedRoute";

import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import InfoTooltip from "./InfoTooltip";
import Burger from "./Burger";

import successIcon from '../images/info-success.svg';
import errorIcon from '../images/info-error.svg';
import defIcon from '../images/info-def.svg';
// import PageNotFound from '../PageNotFound';

import {CurrentUserContext} from "../contexts/CurrentUserContext";

import api from "../utils/api";
import auth from "../utils/auth";
import MobileMenu from "./MobileMenu";

function App() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  function acceptUser({_id, name, email, avatar, about}){
    setCurrentUser({
      userID: _id,
      userName: name,
      userAvatar: avatar,
      userDescr: about
    })

    setEmail(email);
    setLoggedIn(true);
    navigate("/", {replace: true})
  }

  React.useEffect(() => {
    api.getInfo('/cards')
      .then( initCard => setCards(initCard) )
      .catch( error => console.log(error) )
  }, [] );

  React.useEffect(() => {
    api.getInfo('/users/me')
      .then( user => acceptUser(user))
      .catch( error => console.log(error) )

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isBurgerOpen, setBurgerOpen] = React.useState(false);
  const handleBurgerClick = () => setBurgerOpen(check => !check);

  const [isAddPlacePopupOpen,    setAddPlacePopupOpen ]    = React.useState(false);
  const handleAddPlaceClick    = () => setAddPlacePopupOpen(true);

  const [isEditAvatarPopupOpen,  setEditAvatarPopupOpen]   = React.useState(false);
  const handleEditAvatarClick  = () => setEditAvatarPopupOpen(true);

  const [isEditProfilePopupOpen, setEditProfilePopupOpen ] = React.useState(false);
  const handleEditProfileClick = () => setEditProfilePopupOpen(true);

  const [selectedCard, setSelectedCard ] = React.useState({name: '', link: ''});
  const handleCardClick = card => setSelectedCard(card);

  const [isInfoTooltipOpen, setInfoTooltipOpen ] = React.useState(false);
  const [optionsInfoTooltip, setOptionsInfoTooltip ] = React.useState({statusIcon: null, text: "Уведомление.."}); //error


  function handleDeleteClick({_id}) {
    api.removeUserCard(`/cards/${_id}`)
      .then( () => setCards(cards => cards.filter((c) => c._id !== _id)) )
      .catch( error => console.log(error) )
  }

  function handleLikeClick(card) {
    const isLiked = card.likes.some(i => i._id === currentUser.userID);

    const method = isLiked ? 'DELETE' : 'PUT'

    api.setLikeStatus({
      url: `/cards/${ card._id }/likes`,
      method
    })
      .then( newCard => setCards(state => state.map((c) => c._id === card._id ? newCard : c)) )
      .catch( error => console.log(error) )
  }


  function handleUpdateAvatar(avatar) {
    api.updateAvatar(avatar,'/users/me/avatar')
      .then( ({ avatar }) => {
        setCurrentUser({
          ...currentUser,
          userAvatar: avatar
        });

        closeAllPopups();
      })
      .catch( error => console.log(`Ошибка при обновлении аватарки: ${error}`) )
  }

  function handleUpdateUser(userInfo) {
    api.editUserProfile(userInfo,'/users/me')
      .then( user => {
        setCurrentUser({
          userID: user._id,
          userName: user.name,
          userAvatar: user.avatar,
          userDescr: user.about
        });

        closeAllPopups();
      })
      .catch( error => console.log(`Ошибка при редактировании профиля: ${error}`) )
  }

  function handleAddPlaceSubmit(dataPlace) {
    api.addUserCard(dataPlace,'/cards')
      .then( newCard => {
        setCards([newCard,...cards]);

        closeAllPopups();
      })
      .catch( error => console.log(`Ошибка при добавлении новой карточки: ${error}`) )
  }

  function handleRegisterSubmit(email,password){
    auth.signUp({email, password})
        .then( (user) => {
            showTooltipInfo({
              type: "success",
              text: `Пользователь ${user.email} был успешно зарегистрирован`
            });

            acceptUser(user)
        })
        .catch( error => {
          if ( error.status === 401 || error.status === 400 ) {
            showTooltipInfo({
              type: "error",
              text: 'Некорректно заполнено одно из полей'
            });
          } else {
            showTooltipInfo({});
          }

          console.log(`Ошибка при регистрации: ${error.status} ${error.statusText}`)
        })
  }

  function handleAuthorizationSubmit(username, password){
    auth.signIn({email: username, password})
        .then( (user) => {
          showTooltipInfo({
            type: "success",
            text: `Добро пожаловать, ${user.name}`
          });

          acceptUser(user)
        })
        .catch( error => {
          if ( error.status === 400 ) {
            showTooltipInfo({
              type: "error",
              text: 'Пользователь с данным E-mail не найден'
            });
          } else if ( error.status === 401 ) {
            showTooltipInfo({
              type: "error",
              text: 'Некорректно заполнено поле E-mail или Пароль'
            });
          } else {
            showTooltipInfo({});
          }

          console.log(`Ошибка при авторизации: ${error.status} ${error.statusText}`)
        })
  }

  function showTooltipInfo({type, text}){
    let statusIcon = ( type === 'success' )
      ? successIcon
      : ( type === 'error' )
        ? errorIcon
        : defIcon

    if ( !text ) text = 'Что-то пошло не так!\nПопробуйте ещё раз.';

    setOptionsInfoTooltip({ statusIcon, text });

    setInfoTooltipOpen(true);
  }

  const logOut = () => {
    auth.logOut()
        .then( () => {
          setLoggedIn(false);
          setBurgerOpen(false);
          closeAllPopups();
        })
      .catch( err => console.log('Ошибка при выходе из аканаута', err) )
  }

  const closeAllPopups = () => {
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setInfoTooltipOpen(false);
    setOptionsInfoTooltip({statusIcon: null, text: "Уведомление.."});
    setSelectedCard({name: '', link: ''});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">

          <Routes>
            <Route path="/sign-in" element={
              <>
                <Header content={
                  <NavLink className="menu__nav" to="/sign-up">Регистрация</NavLink>
                }/>
                <Login onSubmit={handleAuthorizationSubmit} />
              </>
            } />

            <Route path="/sign-up" element={
              <>
                <Header content={
                  <NavLink className="menu__nav" to="/sign-in">Войти</NavLink>
                }/>
                <Register onSubmit={handleRegisterSubmit} />
              </>
            } />

            <Route path="/" element={
              <>
                <MobileMenu isOpen={isBurgerOpen} logOut={logOut} email={email} />
                <Header content={
                 <>
                  <div className="menu__bar">
                    <p className="menu__email">{email}</p>
                    <NavLink onClick={logOut} className="menu__nav" to="/sign-in">Выйти</NavLink>
                  </div>
                  <Burger isOpen={isBurgerOpen} onBurger={handleBurgerClick}/>
                 </>
                }/>
                <ProtectedRoute element={Main}
                  cards={cards}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onCardClick={handleCardClick}
                  onCardDelete={handleDeleteClick}
                  onCardLike={handleLikeClick}
                  loggedIn={loggedIn} />
              </>
            }/>
            {/*<Route path='*' element={<PageNotFound />} />*/}
          </Routes>

          {loggedIn && <Footer />}

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onAddPlace={handleAddPlaceSubmit} onClose={closeAllPopups} />

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onUpdateUser={handleUpdateUser} onClose={closeAllPopups} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onUpdateAvatar={handleUpdateAvatar} onClose={closeAllPopups} />

          <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

          <InfoTooltip isOpen={isInfoTooltipOpen} options={optionsInfoTooltip} name="confirm" onClose={closeAllPopups}/>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

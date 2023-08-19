import React from "react";

function AuthForm({title, titleSubmit, placeholder, username, password, handleChangeInputUsername, handleChangeInputPassword, handleSubmit, children}) {
    return (
        <div className="authForm">
            <p className="authForm__title">{title}</p>
            <form onSubmit={handleSubmit} className="authForm__form">
                <input
                    type="email"
                    name="email"
                    value={username || ''}
                    className="authForm__input"
                    placeholder="Адрес вашей эл. почты"
                    minLength={2}
                    maxLength={40}
                    onChange={handleChangeInputUsername}
                    required
                />

                <input
                    type="password"
                    name="password"
                    value={password || ""}
                    className="authForm__input"
                    placeholder={placeholder}
                    minLength={2}
                    maxLength={200}
                    onChange={handleChangeInputPassword}
                    required
                />

                <button type="submit" className="authForm__submit">{titleSubmit}</button>
            </form>
            {children || ''}
        </div>
    )
}
export default AuthForm
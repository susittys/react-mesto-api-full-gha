import React from "react";
import {Link} from "react-router-dom";
import AuthForm from "./AuthForm";

function Register({onSubmit}) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    React.useEffect( () => {
        setEmail('');
        setPassword('');
    }, [] );

    const handleChangeInputEmail = (e) => setEmail(e.target.value);
    const handleChangeInputPassword = (e) => setPassword(e.target.value);

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(email,password);
    }

    return (
        <AuthForm
            title="Регистрация"
            titleSubmit="Зарегистрироваться"
            placeholder="Придумайте пароль"
            username={email}
            password={password}
            handleChangeInputUsername={handleChangeInputEmail}
            handleChangeInputPassword={handleChangeInputPassword}
            handleSubmit={handleSubmit}
        >
            <div className="authForm__sign-in">
                <Link to="/sign-in" className="authForm__sign-in-link">Уже зарегистрированы? Войти</Link>
            </div>
        </AuthForm>
    )
}

export default Register;
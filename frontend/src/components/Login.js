import React from "react";
import AuthForm from "./AuthForm";

function Login({onSubmit}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    React.useEffect( () => {
        setUsername('');
        setPassword('');
    }, [] );

    const handleChangeInputUsername = (e) => setUsername(e.target.value);
    const handleChangeInputPassword = (e) => setPassword(e.target.value);

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(username,password);
    }

    return (
        <AuthForm
            title="Вход"
            titleSubmit="Войти"
            placeholder="Введите пароль"
            username={username}
            password={password}
            handleChangeInputUsername={handleChangeInputUsername}
            handleChangeInputPassword={handleChangeInputPassword}
            handleSubmit={handleSubmit}
        />
    )
}

export default Login;
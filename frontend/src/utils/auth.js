class Auth {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    checkToken(jwt){
        return fetch(this._baseUrl + '/users/me', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${jwt}`
            }
        }).then(this._checkResponse)
    }

    signUp({email, password}){
        if ( email && password ){
            return this._request({email, password}, '/signup')
        } else {
            console.log('Ошибка с данными аутентификации')
        }
    }

    signIn({email, password}){
        if ( email && password ){
            return this._request({email, password}, '/signin')
        } else {
            console.log('Ошибка с данными аутентификации')
        }
    }

    _request({email, password}, url){
        return fetch(this._baseUrl + url, {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: this._headers
        }).then(this._checkResponse)
    }

    _checkResponse = res => res.ok
        ? Promise.resolve(res.json())
        : Promise.reject(res)
}

const auth = new Auth({
    baseUrl: 'https://auth.nomoreparties.co',
    headers: {
        'Accept': "application/json",
        'Content-Type': "application/json",
    },
});

export default auth;
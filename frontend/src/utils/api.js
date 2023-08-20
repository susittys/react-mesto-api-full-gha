class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    getInfo(url){
        return this._request( url, {
            method: 'GET'
        })
    }

    _request(url, options) {
        return fetch(this._baseUrl + url, {
            headers: this._headers,
            credentials: 'include',
            ...options
        }).then(this._checkResponse)
    }

    _checkResponse(res){
        return ( res.ok )
            ? res.json()
            : Promise.reject(`Ошибка: ${ res.status }`)
    }

    updateAvatar(avatar, url){
        return this._request( url, {
            method: 'PATCH',
            body: JSON.stringify(avatar)
        })
    }

    addUserCard(data, url){
        return this._request( url, {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    editUserProfile({ name, job }, url){
        return this._request( url, {
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                about: job
            })
        })
    }

    setLikeStatus({ url, method }){
        return this._request( url, {
            method
        })
    }

    removeUserCard(url){
        return this._request( url, {
            method: 'DELETE'
        })
    }
}

const api = new Api({
    baseUrl: 'https://api.askelove.nomoreparties.co',
    headers: {
        'Content-Type': "application/json",
    },
});

export default api;
class Api {
    constructor({ baseUrl, headers }) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    executeRequest(url){
        return this._request( url, {
            headers: this._headers,
            method: 'GET'
        })
    }

    _request(url, options) {
        return fetch(this._baseUrl + url, options).then(this._checkResponse)
    }

    _checkResponse(res){
        return ( res.ok )
            ? res.json()
            : Promise.reject(`Ошибка: ${ res.status }`)
    }

    updateAvatar(avatar, url){
        return this._request( url, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify(avatar)
        })
    }

    addUserCard(data, url){
        return this._request( url, {
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    editUserProfile({ name, job }, url){
        return this._request( url, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                name: name,
                about: job
            })
        })
    }

    setLikeStatus({ url, method }){
        return this._request( url, {
            headers: this._headers,
            method
        })
    }

    removeUserCard(url){
        return this._request( url, {
            headers: this._headers,
            method: 'DELETE'
        })
    }
}

const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-65',
    headers: {
        authorization: 'f7452356-457e-4c18-bc82-10cbc145928e',
        'Content-Type': 'application/json'
    }
});

export default api;
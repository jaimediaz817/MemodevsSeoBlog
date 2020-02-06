import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import Router from 'next/router';

// Bug sección #18
// export const handleResponse = response => {
//     if (response.status === 401) {
//         console.log("actions - handleResponse")
//         signout(()=> {
//             Router.push({
//                 pathname: '/signin',
//                 query: {
//                     message: 'La sesión utilizada ha expirado en la plataforma, por favor inicie sesión nuevamente.'
//                 }
//             });
//         });
//     } else {
//         return;
//     }
// }

export const handleResponse = response => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: '/signin',
                query: {
                    message: 'Your session is expired. Please signin'
                }
            });
        });
    }
};

// PRE - SIGNUP
export const preSignup = (user) => {
    return fetch(`${API}/pre-signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}

export const signup = (user) => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}

export const signin = (user) => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}

//  SET COOKIE 
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key,value, {
            expires: 1
        });
        
    }
}

export const removeCookie = (key) => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });    
    }
}

// GET COOKIE 

export const getCookie = (key) => {
    if (process.browser) {
        return cookie.get(key);
    }
}

// LOCAL STORAGE
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export const removeLocalStorage = (key) => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
}

// AUTHENTICATE USER BY DATA TO COOKIE AND LOCALSTORAGE
export const authenticate = (data, next) => {
    setCookie('token', data.token)
    setLocalStorage('user', data.user);
    // TODO: Callback => Middleware
    next();
}

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            }
            else
            {
                return false;
            }
        }
    }
}

// 318 345 11 02
//.................................................................
// SIGNOUT - CERRAR SESIÓN
export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');    
    next();
    return fetch(`${API}/signout`, {
        method: 'GET'
    })    
    .then(response => {
        console.log('SIGNOUT SUCCESS')        
    })
    .catch(error => console.log(error));
}

export const updateUserProfile = (user, next) => {
    if (process.browser) {
        if (localStorage.getItem('user')) {
            let auth = JSON.parse(localStorage.getItem('user'))
            auth = user
            localStorage.setItem('user', JSON.stringify(auth))
            next();
        }
    }
}

export const forgotPassword = (email) => {
    return fetch(`${API}/forgot-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}

export const resetPassword = (resetInfo) => {
    return fetch(`${API}/reset-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}

/* 
TODO: ESTILOS AVATAR
    max-width: 100px;
    height: 100px;
    width: 100px;
    border: 3px solid #2264ab;
    object-fit: cover;
    /* border-radius: 50%;
*/

export const loginWithGoogle = (user) => {
    return fetch(`${API}/google-login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
}
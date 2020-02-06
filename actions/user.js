import fetch from 'isomorphic-fetch';
import { API } from '../config';

// CRUD
export const userPublicProfile = (username) => {
    return fetch(`${API}/user/${username}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
};

// GET Profile
export const getProfile = (token) => {
    return fetch(`${API}/user/profile`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
};

export const updateProfile = (token, user) => {
    return fetch(`${API}/user/update`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: user
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
};
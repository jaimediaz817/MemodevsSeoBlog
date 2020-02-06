import fetch from 'isomorphic-fetch';
import { API } from '../config';
import queryString from 'query-string';
import { isAuth, handleResponse } from './auth';

// CRUD
export const createBlog = (blog, token) => {

    // Lógica para acceder al Endpoint
    let createBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/blog`
    } if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${API}/user/blog`
    }

    return fetch(`${createBlogEndpoint}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${ token }`
        },
        body: blog
    })
    .then(response => {
        handleResponse(response);
        return response.json()
    })
    .catch(error => console.log(error));
};

// LISTAR Blog - Categorias - Tags
export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit,
        skip
    }
    return fetch(`${API}/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
};

// OBTENER un detalle de blog
export const singleBlog = slug => {
    return fetch(`${API}/blog/${slug}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}

// LISTAR Blog - RELACIONADOS
export const listRelatedBlog = (blog) => {

    return fetch(`${API}/blogs/related`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));
};


// TODO: sección #13
// LISTAR blogs 
export const list = (username) => {

    // Lógica para acceder al Endpoint
    let listBlogsEndpoint;

    if (username) {
        listBlogsEndpoint = `${API}/${username}/blogs`
    } else {
        listBlogsEndpoint = `${API}/blogs`
    }
    
    return fetch(`${listBlogsEndpoint}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}


export const removeBlog = (slug, token) => {

    // Lógica para acceder al Endpoint
    let deleteBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        deleteBlogEndpoint = `${API}/blog/${slug}`
    } if (isAuth() && isAuth().role === 0) {
        deleteBlogEndpoint = `${API}/user/blog/${slug}`
    }

    return fetch(`${deleteBlogEndpoint}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ token }`
        }
    })
    .then(response => {
        handleResponse(response);
        return response.json()
    })
    .catch(error => console.log(error));
};


export const updateBlog = (blog, token, slug) => {

    // Lógica para acceder al Endpoint
    let updateBlogEndpoint;

    if (isAuth() && isAuth().role === 1) {
        updateBlogEndpoint = `${API}/blog/${slug}`
    } if (isAuth() && isAuth().role === 0) {
        updateBlogEndpoint = `${API}/user/blog/${slug}`
    }    

    return fetch(`${updateBlogEndpoint}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            Authorization: `Bearer ${ token }`
        },
        body: blog
    })
    .then(response => {
        handleResponse(response);
        return response.json()
    })
    .catch(error => console.log(error));
};

// TODO: sección #16
// LISTAR blogs 
export const listBlogsSearch = (params) => {
    console.log('parametros: ', params)
    let query = queryString.stringify(params); // ?limit=10&pagination=10
    console.log('parametros de consulta: ', query);
    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}
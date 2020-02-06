import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import moment from 'moment';
import 'moment/locale/es';
import { getCookie, isAuth } from './../../actions/auth';

import { list, removeBlog } from './../../actions/blog';

const BlogRead = ({username}) => {

    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState('');
    const token = getCookie('token');

    useEffect(()=>{
        loadBlogs()
    }, []);

    const loadBlogs = () => {
        list(username).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setBlogs(data);
            }
        })
    }

    const deleteBlog = (slug) => {
        removeBlog(slug, token).then(data=>{
            if (data.error) {
                console.log(data.error);
            } else {
                setMessage(data.message);
                loadBlogs();
            }
        })
    }

    const deleteConfirm = slug => {
        let answer = window.confirm('Estás seguro que deseas eliminar este Blog?');
        if (answer) {
            deleteBlog(slug);
        }
    }

    const showUpdateButton = (blog) => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Actualizar Blog</a>
                </Link>
            );
        } else if(isAuth() && isAuth().role === 1) {
            return(
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-warning ml-2">Actualizar Blog</a>
                </Link>            
            );
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i)=>{
            return (
                <div key={i} className="pb-5">
                    <h3>{blog.title}</h3>
                    <div className="mark">
                        Escrito por {blog.postedBy.name} | Publicado en { moment(blog.updatedAt).fromNow()}
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={()=> deleteConfirm(blog.slug)}> Borrar Blog</button>
                    { showUpdateButton(blog) }
                </div>
            )
        })
    }

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                    { message && (
                        <div className="alert alert-warning">
                        { message }
                        </div>
                    )}
                    { showAllBlogs()}
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default BlogRead;
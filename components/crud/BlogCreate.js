import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from './../../actions/auth';
import { getCategories } from './../../actions/category';
import { getTags } from './../../actions/tag';
import { createBlog } from './../../actions/blog';
const ReactQuill =  dynamic(() => import('react-quill'), {ssr: false})
import '../../node_modules/react-quill/dist/quill.snow.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';

const CreateBlog = ({ router }) => {

    const blogFromLS = () => {
        if (typeof window === 'undefined') {
            return false;
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return false;
        }
    }

    // creando estados globales

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);


    const [checked, setChecked] = useState([]); // catgegories
    const [checkedTag, setCheckedTag] = useState([]); // tags

    const [body, setBody] = useState(blogFromLS())
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    });

    const { error, sizeError, success, formData, title, hidePublishButton } = values;
    const token = getCookie('token');

    useEffect(()=>{
        setValues({...values, formData: new FormData()});
        // inicializando
        initCategories();
        initTags();
    }, [router])

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({
                    ...values, 
                    error: data.error
                })
            } else {
                setCategories(data)
            }
        });        
    }

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({
                    ...values, 
                    error: data.error
                })
            } else {
                setTags(data);
            }
        });
    }

    // Crear BLOG
    const publishBlog = (e) => {
        e.preventDefault();
        console.log('ready to publish');
        createBlog(formData, token).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error
                })
            } else {
                setValues({
                    ...values,
                    title: '',
                    error: '',
                    success: `Blog creado correctamente con el título: "${data.title}" en la base de datos`                    
                })
                setBody('')
                setCategories([]);
                setTags([]);
            }
        }).catch(err => console.log(err))
    }

    const handleChange = name => e => {
        console.log(e.target.value)
        // validando el origen del dato:
        const value = name === 'photo' ? e.target.files[0] : e.target.value;

        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''})
    }

    const handleBody = e => {
        console.log(e)
        setBody(e)
        formData.set('body', e)

        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e))
        }
    }

    // UI - categorias y tags
    const handleToggle = (c) => () => {
        setValues({
            ...values,
            error: ''
        })
        // return the first index or -1
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];

        if (clickedCategory === -1) {
            all.push(c);
        } else {
            all.splice(clickedCategory, 1);
        }

        console.log(all)
        setChecked(all);
        formData.set('categories', all)
    }

    // tags 
    const handleTagsToggle = (t) => () => {
        setValues({
            ...values,
            error: ''
        })
        // return the first index or -1
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];

        if (clickedTag === -1) {
            all.push(t);
        } else {
            all.splice(clickedTag, 1);
        }

        console.log(all)
        setCheckedTag(all);
        formData.set('tags', all)        
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li className="list-unstyled" key={ i }>
                    <input onChange={ handleToggle(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{ c.name }</label>
                </li> 
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li className="list-unstyled" key={ i }>
                    <input  onChange={ handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{ t.name }</label>
                </li> 
            ))
        )
    }

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            { error }
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            { success }
        </div>
    )    

    const createBlogForm = () =>{
        return (
            <form onSubmit={ publishBlog }>
                <div className="form-group">
                    <label className="text-muted">Titulo</label>
                    <input type="text" className="form-control" onChange={ handleChange('title') } value={ title }/>
                </div>

                <div className="form-group">
                    <ReactQuill 
                        modules={ QuillModules }
                        formats={ QuillFormats }
                        value={ body } 
                        placeholder="Puede escribir algo acá..." 
                        onChange={ handleBody } 
                    />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">Publicar</button>
                </div>
            </form>
        )
    }

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                <h2>Create Blog Form</h2>
                    { createBlogForm() }
                    <div className="pb-3">
                        { showError() }
                        { showSuccess() }
                    </div>
                </div>

                <div className="col-md-4">           
                    <div className="form-group pb-2">
                        <h5>Futura imagen</h5>
                        <hr />
                        <small className="text-muted d-block">Tamaño máximo: 1 MB</small>
                        <label className="btn btn-outline-info">Upload featured Image
                            <input onChange={ handleChange('photo')} type="file" accept="image/*" hidden/>
                        </label>
                    </div>         
                    <div>
                        <h5>Categorías</h5>
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        { showCategories() }
                        </ul>                        
                    </div>
                    
                    <div>
                        <h5>Tags</h5>
                        <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
                        { showTags() }
                        </ul>                        
                    </div>                    
                </div>
            </div>
        </div>
    );
   
}

export default withRouter(CreateBlog);

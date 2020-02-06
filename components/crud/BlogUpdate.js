import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuth } from './../../actions/auth';
import { getCategories } from './../../actions/category';
import { getTags } from './../../actions/tag';
import { singleBlog, updateBlog } from './../../actions/blog';
const ReactQuill =  dynamic(() => import('react-quill'), {ssr: false})
import '../../node_modules/react-quill/dist/quill.snow.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';
import {API} from '../../config';

const BlogUpdate = ({router}) => {


    // Categorías y Etiquetas
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checked, setChecked] = useState([]); // catgegories
    const [checkedTag, setCheckedTag] = useState([]); // tags    

    // Elementos del Blog
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        title: '',
        error: '',
        success: '',
        formData: '',      
    });    

    const { title, error, success, formData } = values;

    const token = getCookie('token');

    useEffect(()=>{
        setValues({...values, formData: new FormData()})
        // Inicializando mecanismos de retorno de data
        initBlog();
        initCategories();
        initTags();
    }, [router]);


    // Inicializando Categorías y Tags
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
        }).catch(err => console.log(err))
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
        }).catch(err => console.log(err))
    }    

    // Inicializando el Blog 
    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {                    
                    setValues({...values, title: data.title});
                    setBody(data.body);
                    // Categories and Tags
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            }).catch(err => console.log(err))
        }
    }

    const setCategoriesArray = blogCategories => {
        let ca = []
        blogCategories.map((c,i)=> {
            ca.push(c._id)
        });
        setChecked(ca);
    }

    const setTagsArray = blogTags => {
        let ta = []
        blogTags.map((t,i)=> {
            ta.push(t._id)
        });
        setCheckedTag(ta);        
    }

    const handleChange = name => e => {
        console.log(e.target.value)
        // validando el origen del dato:
        const value = name === 'photo' ? e.target.files[0] : e.target.value;

        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''})
    }    

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    }

    // Save Blog - UPDATE
    const editBlog = e => {
        e.preventDefault();
        updateBlog(formData, token, router.query.slug).then(data=>{
            if (data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, title: '', success: `Título del blog: ${data.title} se ha actualizado correctamente`});
                if (isAuth() && isAuth().role === 1) {
                    //Router.replace(`/admin/crud/${router.query.slug}`);
                    setTimeout(()=>{
                        Router.replace(`/admin`);
                    }, 3000)
                    
                } else if(isAuth() && isAuth().role === 0) {
                    //Router.replace(`/user/crud/${router.query.slug}`);
                    Router.replace(`/user`);
                }
            }
        }).catch(err => console.log(err))
        //console.log('actualizando en blog');
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


    const findOutCategory = c => {
        const result = checked.indexOf(c)
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const findOutTag = t => {
        const result = checkedTag.indexOf(t)
        if (result !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li className="list-unstyled" key={ i }>
                    <input 
                        onChange={ handleToggle(c._id)} 
                        type="checkbox" 
                        className="mr-2" 
                        checked={findOutCategory(c._id)}
                    />
                    <label className="form-check-label">{ c.name }</label>
                </li> 
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li className="list-unstyled" key={ i }>
                    <input  
                        onChange={ handleTagsToggle(t._id)} 
                        type="checkbox" 
                        className="mr-2" 
                        checked={findOutTag(t._id)}
                    />
                    <label className="form-check-label">{ t.name }</label>
                </li> 
            ))
        )
    }

    // UI - MENSAJES 
    const showError = () => {
        return(
            <div className="alert alert-danger" style={{display: error ? '':'none'}}>
            {error}
            </div>
        );
    }

    const showSuccess = () => {
        return(
            <div className="alert alert-success" style={{display: success ? '':'none'}}>
            {success}
            </div>
        );
    }    

    const updateBlogForm = () =>{
        return (
            <form onSubmit={ editBlog }>
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
                    <button type="submit" className="btn btn-primary">Actualizar Blog</button>
                </div>
            </form>
        )
    }    

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    <h2>Create Blog Form</h2>
                    { updateBlogForm()}
                    <p>Create blog form</p>
                    <div className="pb-3">
                        <p>show success and error message</p>
                        <div>
                        { showError()}
                        { showSuccess()}
                        </div>
                    </div>
                </div>


                <div className="col-md-4">           
                    <div className="form-group pb-2">
                        <h5>Futura imagen</h5>

                        { body && (
                            <img 
                                src={`${API}/blog/photo/${router.query.slug}`}
                                alt={title}
                                style={{width:'75%', borderRadius: '8px'}}
                            />
                        )}

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

export default withRouter(BlogUpdate);



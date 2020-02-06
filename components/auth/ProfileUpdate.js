import React from 'react';
import link from 'next/link';
import { useState, useEffect } from 'react';
import { getCookie, isAuth, updateUserProfile}  from '../../actions/auth'
import { getProfile, updateProfile } from '../../actions/user'
import { API } from '../../config';

const ProfileUpdate = () => {

    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: ''
    });

    const token = getCookie('token');
    const { username, name, email, about, password, error, success, loading, photo, userData} = values;

    const init = () => {
        getProfile(token).then(data=> {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about                    
                });                
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        init();
    }, []);

    // UI ---------------------------------
    const handleChange = name => e => {
        console.log(e.target.value)
        // validando el origen del dato:
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        let userFormData = new FormData();
        userFormData.set(name, value);
        setValues({...values, [name]: value, userData: userFormData, error: false, success: false})
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({
            ...values,
            loading: true
        })
        updateProfile(token, userData).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    success: false,
                    loading: false
                })
            } else {
                // set localStorage
                updateUserProfile(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        success: true,
                        loading: false,
                        error: false                
                    });  
                });                  
            }
        })        
    }


    const profileUpdateForm = () => (
        <form onSubmit={ handleSubmit }>
            <div className="form-group">
                <small className="text-muted d-block">Tamaño máximo: 1 MB</small>
                <label className="btn btn-outline-info">Foto de perfil
                    <input onChange={ handleChange('photo')} type="file" accept="image/*" hidden/>
                </label>                
            </div>

            <div className="form-group">
                <label className="text-muted">Nombre de usuario</label>
                <input 
                    type="text"
                    value={username}
                    className="form-control"
                    onChange={ handleChange('username') }
                />
            </div>            

            <div className="form-group">
                <label className="text-muted">Nombres</label>
                <input 
                    type="text"
                    value={name}
                    className="form-control"
                    onChange={ handleChange('name') }
                />
            </div>            

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input 
                    type="email"
                    value={email}
                    className="form-control"
                    onChange={ handleChange('email') }
                />
            </div>                        

            <div className="form-group">
                <label className="text-muted">Sobre el usuario</label>
                <textarea 
                    type="text"
                    value={about}
                    className="form-control"
                    onChange={ handleChange('about') }
                />
            </div>  
            
            <div className="form-group">
                <label className="text-muted">Contraseña</label>
                <input 
                    type="password"
                    value={password}
                    className="form-control"
                    onChange={ handleChange('password') }
                />
            </div>             

            <div>
                <button className="btn btn-primary" type="submit">
                    Actualizar datos del perfil
                </button>
            </div>
        </form>
    );

    const showError = () => {
        return (
            <div className="alert alert-danger" style={{ display: error ? '': 'none'}}>
            {error}
            </div>
        );        
    }

    const showSuccess = () => {
        return (
            <div className="alert alert-success" style={{ display: success ? '': 'none'}}>
                Perfil actualizado correctamente
            </div>
        );        
    }


    const showLoading = () => {
        return (
            <div className="alert alert-info" style={{ display: loading ? '': 'none'}}>
            Cargando...
            </div>
        );        
    }    

    return (
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">   
                        <img 
                            src={`${API}/user/photo/${username}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{ maxHeight: 'auto', maxWidth: '100%' }}
                            alt="Perfil del usuario (Foto/Avatar)"
                        />                      
                    </div>
                    <div className="col-md-8 mb-5">
                    { showSuccess() }
                    { showError() }
                    { showLoading() }
                    { profileUpdateForm()}
                    </div>
                </div>

            </div>
        </React.Fragment>
    );
}

export default ProfileUpdate;

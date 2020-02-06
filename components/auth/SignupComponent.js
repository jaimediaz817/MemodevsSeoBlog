import { useState, useEffect } from 'react';
import { signup, isAuth, preSignup } from '../../actions/auth';    
import Router from 'next/router';
import Link from 'next/link';

const SignupComponent = () => {

    // ESTADOS
    const [values, setValues] = useState({
        name: 'Jaime',
        email: 'jaimeivan0017@gmail.com',
        password: '123456',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { name, email, password, error, loading, message, showForm} = values;

    // USE EFFECT
	useEffect(() => {
		isAuth() && Router.push(`/`)
	}, [])    

    const handleSubmit = (e) => {
        e.preventDefault();        
        console.log('handle submit')
        console.table({ name, email, password, error, loading, message, showForm });

        setValues({
            ...values,
            loading: true,
            error: false
        });

        const user = { name, email, password };

        // TODO: refactorizado
        preSignup(user)
        .then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false
                })
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    loading: false,
                    message: data.message,
                    showForm: false
                });
            }
        });
    };

    const handleChange = name => (e) => {
        e.preventDefault();        
        console.log('handle change', e.target.value)
        setValues({
            ...values, 
            error: false, 
            [name]: e.target.value
        })
    };

    const showLoading = () => (loading ? <div className="alert alert-info">Cargando...</div> : '');
    const showLError = () => (error ? <div className="alert alert-danger">{ error }</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info">{ message }</div> : '');

    const signupForm = () => {
        return (
            <form onSubmit={ handleSubmit }>
                <div className="form-group">
                    <input 
                        value={ name }
                        onChange={ handleChange('name') }
                        type="text"
                        className="form-control"
                        placeholder="Ingrese su nombre"
                    />
                </div>

                <div className="form-group">
                    <input 
                        value={ email }
                        onChange={ handleChange('email') }
                        type="email"
                        className="form-control"
                        placeholder="Ingrese su correo electrónico"
                    />
                </div>
                
                <div className="form-group">
                    <input 
                        value={ password }
                        onChange={ handleChange('password') }
                        type="password"
                        className="form-control"
                        placeholder="Ingrese su contraseña"
                    />
                </div>

                <div>
                    <button className="btn btn-primary">
                        Registrarse
                    </button>
                </div>
            </form>
        );
    };

    // RENDER MAIN
    return (
        <React.Fragment>
            { showLError() }
            { showLoading() }
            { showMessage() }
            { showForm && signupForm() }
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">Recuperar la contraseña</a>
            </Link>
        </React.Fragment>
    );
}

export default SignupComponent; 
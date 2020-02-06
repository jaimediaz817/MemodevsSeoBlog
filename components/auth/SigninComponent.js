import { useState, useEffect } from 'react';
import { 
	signin,
	authenticate,
	isAuth
} from '../../actions/auth';    
import Router from 'next/router';
import Link from 'next/link';
// Google Auth
import LoginGoogle from './LoginGoogle';

const SigninComponent = () => {

    // ESTADOS
    const [values, setValues] = useState({
        email: 'jaimeivan0017@gmail.com',
        password: '123456',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

	const { email, password, error, loading, message, showForm} = values;
	
	useEffect(() => {
		isAuth() && Router.push(`/`)
	}, []);

    const handleSubmit = (e) => {
        e.preventDefault();        
        console.log('handle submit')
        console.table({ email, password, error, loading, message, showForm });

        setValues({
            ...values,
            loading: true,
            error: false
        });

        const user = { email, password };

        signin(user).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false
                })
            } else {

				// SIGN IN OPERATIONS

				// save user token to Cookie

				// Save user info to Localstorage

				// Authenticate User
				authenticate(data, ()=> {
					if (isAuth() && isAuth().role == 1) {
						Router.push(`/admin`);	
					}
					else
					{
						Router.push(`/user`);	
					}					
				});
				
            }
        }).catch(err => console.log(err))
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

    const signinForm = () => {
        return (
            <form onSubmit={ handleSubmit }>
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
                        Iniciar sesión
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
            <LoginGoogle />
            { showForm && signinForm() }
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">Reiniciar la contraseña (recuperar)</a>
            </Link>
        </React.Fragment>
    );
}

export default SigninComponent; 
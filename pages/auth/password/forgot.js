import React, { useState } from 'react'
import Layout from '../../../components/Layout';
import { forgotPassword } from '../../../actions/auth';
import Link from 'next/link';

const forgot = () => {

    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true
    });

    const { email, message, error, showForm } = values;

    const handleChange = name => e => {
        setValues({
            ...values,
            message: '',
            error: '',
            [name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({
            ...values,
            message: '',
            error: ''
        });

        forgotPassword({email}).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error
                })
            } else {
                setValues({
                    ...values,
                    message: data.message, email: '',
                    showForm: false
                })
            }
        })
    }

    const showError = () => {
        return(
            error ? <div className="alert alert-danger">{error}</div> : ''
        );       
    }

    const showMessage = () => {
        return(
            message ? <div className="alert alert-success">{message}</div> : ''
        );       
    }    

    const passwordForgotForm = () => (
        <div className="container">
            <form onSubmit={ handleSubmit }>
                <div className="form-group pt-5">
                    <input 
                        type="email"
                        onChange={ handleChange('email') }
                        className="form-control"
                        value={email}
                        placeholder="Escriba el correo electrónico (Email)"
                        required
                    />
                </div>
                <div>
                    <button className="btn btn-primary">Enviar el Link para reiniciar la contraseña en  la plataforma</button>
                </div>
            </form>
        </div>
    )

    return (
        <Layout>
            <div className="container">
                <h2>¿Has olvidado la contraseña?, recuperación a través de Link</h2>
                <hr />
                { showError() }
                { showMessage() }
                { showForm && passwordForgotForm() }
                <br />
            </div>
        </Layout>
    );
}

export default forgot;

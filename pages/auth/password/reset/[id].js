import React, { useState } from 'react'
import Layout from '../../../../components/Layout';
import { resetPassword } from '../../../../actions/auth';
import { withRouter } from 'next/router';

const ResetPassword = ({ router }) => {

    const [values, setValues] = useState({
        name: '',
        newPassword: '',
        error: '',
        message: '',
        showForm: true
    });

    const { showForm, name, newPassword, error, message } = values;

    const handleSubmit = e => {
        e.preventDefault();
        resetPassword({
            newPassword,
            resetPasswordLink: router.query.id
        }).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    showForm: false,
                    newPassword: ''
                })
            } else {
                setValues({
                    ...values,
                    message: data.message,
                    showForm: false,
                    newPassword: '',
                    error: false
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }


    const passwordResetForm = () => (
        <div className="container">
            <form onSubmit={ handleSubmit }>
                <div className="form-group pt-5">
                    <input 
                        type="password"
                        onChange={ e => setValues({ ...values, newPassword: e.target.value })}
                        className="form-control"
                        value={newPassword}
                        placeholder="Escribala nueva contraseña"
                    />
                </div>
                <div>
                    <button className="btn btn-primary">Actualizar contraseña en la plataforma</button>
                </div>
            </form>
        </div>
    );


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

    return (
        <Layout>
            <div className="container-fluid">
                <h2>Reiniciar contraseña</h2>
                <hr />
                { showError() }
                { showMessage() }
                { passwordResetForm() }
            </div>
        </Layout>
    );
}

export default withRouter(ResetPassword);

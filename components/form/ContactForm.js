import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { emailContactForm } from '../../actions/form';

const ContactForm = ({authorEmail}) => {

    const [values, setValues] = useState({
        message:'',
        name:'',
        email:'',
        sent: false,
        buttonText:'Enviar Mensaje',
        success: false,
        error: false
    });

    const { message, name, email, sent, buttonText, success, error } = values;

    const clickSubmit = (e) => {
        e.preventDefault();
        setValues({
            ...values,
            buttonText: 'Enviando...'
        });

        // action
        emailContactForm({
            authorEmail, name, email, message
        }).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error
                })
            } else {
                console.log("email enciado, estado de values: ", values)
                setValues({
                    ...values,
                    sent: true,
                    name: '',
                    email: '',
                    message: '',
                    buttonText: 'Enviar',
                    success: data.success
                });
            }
        });        
    };

    const handleChange = name => e => {        
        setValues({...values, [name]: e.target.value, error: false, success: false, buttonText: 'Enviar Mensaje'})
    };

    const showSuccessMessage = () => {
        return(
            success && (<div className="alert alert-info">Gracias por contactarme a través de este medio.</div>)            
        );
    }

    const showErrorMessage = () => {
        return(
            error && (<div style={{ display: error ? '' : 'none' }} className="alert alert-danger">{ error }</div>)
        );
    }

    const contactForm = () => {
        return(
            <form onSubmit={ clickSubmit } className="pb-5">
                <div className="form-group">                
                    <label className="lead">Mensaje</label>
                    <textarea 
                        onChange={handleChange('message')}
                        type="text"
                        className="form-control"
                        values={message}
                        rows="10"
                        required
                    ></textarea>
                </div>
                <div className="form-group">                
                    <label className="lead">Nombres</label>
                    <input 
                        type="text"
                        onChange={handleChange('name')}
                        className="form-control"
                        value={name}
                        required
                    />
                </div>                
                <div className="form-group">                
                    <label className="lead">Email</label>
                    <input 
                        type="email"
                        onChange={handleChange('email')}
                        className="form-control"
                        value={email}
                        required
                    />
                </div>
                <div className="form-group">                
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >{ buttonText }</button>
                </div>                 
            </form>
        );
    }

    return (
        <React.Fragment>
            { showSuccessMessage() }
            { showErrorMessage() }
            { contactForm() }
        </React.Fragment>
    );
}

export default ContactForm;

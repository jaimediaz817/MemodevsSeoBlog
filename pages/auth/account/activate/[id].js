import React, { useState, useEffect } from 'react'
import jwt from 'jsonwebtoken'
import Layout from '../../../../components/Layout';
import { withRouter } from 'next/router';
import { signup } from '../../../../actions/auth';

const ActiveAccount = ({router}) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        loading: false,
        success: false,
        showButon: true                
    });

    const { name, token, error, loading, success, showButon} = values;

    useEffect(()=> {
        let token = router.query.id;

        if (token) {
            const {name} = jwt.decode(token);
            setValues({
                ...values,
                name,
                token
            });            
        }    
    }, [router]);

    const clickSubmit = e => {
        e.preventDefault();
        setValues({
            ...values,
            loading: true,
            error: false,            
        });

        signup({token}).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false,
                    showButton: false
                });            
            } else {
                setValues({
                    ...values,
                    loading: false,
                    success: true,
                    showButon: false
                });
            }
        }).catch(err => console.log(err))
    }

    const showLoading = () => (
        loading ? <h2>Loading</h2> : ''
    );

    return(
        <Layout>
            <div className="container">
                <h3 className="pn-4">Hey {name}, Ready to activate your account? </h3>
                { showLoading() }
                { error && <div className="pr-4 pb-4">{error}</div> }
                { success && 'Tu cuenta se ha activado satisfactoriamente en nuestra plataforma, por favor inicie sesión.'}
                { showButon && (
                    <button className="btn btn-outline-primary" onClick={clickSubmit}>
                        Activar cuenta
                    </button>
                )}
            </div>
        </Layout>
    );
}

export default withRouter(ActiveAccount);


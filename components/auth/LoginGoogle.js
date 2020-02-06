import React from 'react';
import link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import GoogleLogin from 'react-google-login';
import { loginWithGoogle, authenticate, isAuth }  from '../../actions/auth'
import { GOOGLE_CLIENT_ID } from '../../config';

const LoginGoogle = () => {

    const responseGoogle = (response) => {
        console.log(response);
        const tokenId = response.tokenId;
        const user = { tokenId };

        loginWithGoogle(user).then(data => {

            if (data.error) {
                console.log(err);
            } else {
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
        })
    }

    return (
        <div className="pb-5 login-with-google-div">
            <GoogleLogin
                clientId={`${GOOGLE_CLIENT_ID}`}
                buttonText="Login a través de Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                theme={'dark'}
            />
        </div>
    );
}

export default LoginGoogle;




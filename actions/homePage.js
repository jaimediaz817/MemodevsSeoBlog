import fetch from 'isomorphic-fetch';
import { API } from '../config';

// ACTIONS
export const sendEmailResponseAction = (response) => {
    return fetch(`${API}/landinPage/emailResponse/toUser`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));    
}


// Trae una pregunta asociada a la respuesta en cuestión (generando respuesta)
export const getCurrentMessageQuestion = (messageContent) => {
    // currentMessageId, messageId
    return fetch(`${API}/landinPage/emailResponse/getQuestions`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageContent)
    })
    .then(response => {
        return response.json()
    })
    .catch(error => console.log(error));     
}
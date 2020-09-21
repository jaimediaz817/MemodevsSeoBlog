import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { getCookie } from '../../actions/auth';
import { 
    sendEmailResponseAction,
    getCurrentMessageQuestion
} from '../../actions/homePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faCheck,  faQuestion} from '@fortawesome/free-solid-svg-icons'
import toaster from "toasted-notes";
import "toasted-notes/src/styles.css"; // optional styles
import SingleLoader from '../../components/loaders/SingleLoader';

const SendEmailResponse = (props) => {

    let contentMessage = React.createRef();
    const [values, setValues] = useState({
        subject: '',
        error: false,
        success: false,
        headerMessage: "",
        message: "",
        reload: false,
        namesUser: '',
        messageId: '',
        currentMessageId: '',
        emailQuestionTo: '',
        loading: false
    });

    const [question, setQuestion] = useState([]);    
 
    const { subject, error, success, headerMessage, message, messageId, currentMessageId, reload, namesUser, emailQuestionTo, loading } = values;
    const token = getCookie('token');
 
    useEffect(() => {
        let nombreUsuario = props.namesUser;
        let currentMessageId = props.currentMessageId;
        console.log("cargando: ", nombreUsuario);
        setValues({
            ...values,
            namesUser: nombreUsuario,
            subject: 'Respuesta a su pregunta/comentario desde la Home de Jaime Díaz.',            
            messageId: `${props.messageId}`,
            currentMessageId: currentMessageId,
            headerMessage: `Estimado ${nombreUsuario}, he recibido su correo y en respuesta le comento:`
        });
        
        contentMessage.current.focus();

        // Load Question
        getQuestions();        
        
    }, [values.namesUser]);

    useEffect(() => {
        console.log("ref content: ", contentMessage)
    }, [])

    // Get Questions
    const getQuestions = () => {
        if (messageId && currentMessageId) {
            getCurrentMessageQuestion({
                messageId, currentMessageId
            }).then( data => {
                if (data.question.userAdmin) {
                    console.log("user ADMIN::   ", data.question.userAdmin[0]);                     
                    setValues({
                        ...values,
                        emailQuestionTo: data.question.userAdmin[0].email
                    });

                } else {
                    setValues({
                        ...values,
                        emailQuestionTo: data.question.email
                    });
                }        
                setQuestion(data.question);
            }).catch(err => console.log(err))          
        }
    }

    // 
    const clickSubmit = e => {
        e.preventDefault();
        setValues({
            ...values,
            loading: true,            
        });

        console.log("values: ", values);
        // acciones: 
        sendEmailResponseAction({
            subject, 
            headerMessage, 
            message, 
            messageId, 
            currentMessageId, 
            emailQuestionTo,
            namesUser
        }).then(data => {
            let response = data;
            console.log(data);
            if (response.success) {
                setValues({
                    ...values,
                    success: true,
                    message: '',
                    loading: false
                });

                

                toaster.notify(response.message, {
                    duration: 6000
                });

                getQuestions();
            }
        }).catch(err => {
            setValues({
                ...values,
                success: false,
                loading: false,
                error: err
            })
            // toaster.notify(response.message, {
            //     duration: 6000
            // });            
            console.log(err)
        });      
    };
 
    const handleChange = name => e => {
        setValues({ ...values, [name]: e.target.value, error: false, success: false });
    };

    const showQuestion = () => {    

        let bgQuestion = question && (question.isAnswered === 1 ? 'bg-primary' : 'bg-danger')
        console.log("color::::: ", bgQuestion)

        return question ? (
            <div className={`card text-white ${bgQuestion} mb-3`} style={{maxWidth: '18rem'}}>
                <div className="card-header">
                    <span>¿Está resuelta?</span>
                    <span className="float-right">
                    <i>{ question.isAnswered === 1  ? 'Resuelta': 'Sin resolver' }</i>
                    { question.isAnswered === 1  ? <FontAwesomeIcon icon={ faCheck } className="mr-3"/>: <FontAwesomeIcon icon={ faQuestion } className="mr-3"/>}
                    </span>                    
                </div>
                <div className="card-body">
                    <h5 className="card-title">Pregunta planteada:</h5>
                    <p className="card-text"><i>{question.messageUser}</i></p>
                </div>
            </div>                        
        ) : 'No se cargó correctamente la pregunta.'
    }
 
    const showSuccess = () => {
        if (success) {
            return <p className="text-success">El mensaje ha sido enviado</p>;
        }
    };
 
    const showError = () => {
        if (error) {
            return <p className="text-danger">Hubo un error al enviar el correo</p>;
        }
    };

    const showLoading = () => {
        return (
            <SingleLoader loading={loading} />
        );        
    }    
 
    const emailResponseForm = () => (
        <form onSubmit={clickSubmit} className="mt-4">
            <div className="form-group">
                <label className="text-muted">Asunto del email</label>
                <input type="text" className="form-control" onChange={handleChange('subject')} value={subject} required />
            </div>
            <div className="form-group">
                <label className="text-muted">Cabecera del mensaje</label>
                <textarea className="form-control" onChange={handleChange('headerMessage')} value={headerMessage} required />
            </div>            
            <div className="form-group">
                <label className="text-muted">Contenido del mensaje</label>
                <textarea ref={contentMessage} className="form-control" onChange={handleChange('message')} value={message} required />
            </div>
            <div>
                <button type="submit" className="btn btn-primary">
                    <FontAwesomeIcon icon={ faEnvelope } className="mr-3"/>
                    Enviar Email de respuesta
                </button>
            </div>
        </form>
    );
 
    return (
        <React.Fragment>
            {showSuccess()}
            {showError()}

            <div className="row no-gutters">
                <div className="col-md-8">
                    {emailResponseForm()}
                </div>
                <div className="col-md-4 pl-5 pt-5">
                    <div className="form-group border rounded p-3">
                        <h5>Pregunta planteada:</h5>
                        <hr />
                        <span className="text-white">
                        { showQuestion() }
                        </span>
                    </div>
                </div>
            </div>
            { showLoading() }
        </React.Fragment>
    );
};
 
export default SendEmailResponse;
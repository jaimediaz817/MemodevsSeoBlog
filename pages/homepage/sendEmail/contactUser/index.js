import React, {useState, useEffect} from 'react';
import Layout from '../../../../components/Layout';
import SendEmailResponse from '../../../../components/homepage/SendEmailResponse';
import { withRouter } from 'next/router';
import 'moment/locale/es';

const EmailResponseLP = ({ router }) => {

    const [values, setValues] = useState({
        namesUser: '',
        messageId: '',
        currentMessageId: ''
    });    

    useEffect(()=>{
        setValues({
            ...values, 
            namesUser: router.query.username,
            messageid: router.query.messageid,
            currentMessageId: router.query.currentmessageid
        }) 
    },[]);

    const { namesUser, messageid, currentMessageId } = values;

    return (
        <React.Fragment>
            <Layout>
                <main>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h1 className="display-4 font-weight-bold text-center">
                                    Responder mensaje enviado desde la Home Page <span className="text-muted display-6">(vía Email)</span>
                                </h1>
                                <SendEmailResponse 
                                    namesUser={router.query.username}
                                    messageId={router.query.messageid}
                                    currentMessageId={router.query.currmessageid}
                                />
                                <div>
                                index PADRE { JSON.stringify(router) }                                
                                </div>                                
                            </div>
                        </div>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    );
}

export default withRouter(EmailResponseLP);

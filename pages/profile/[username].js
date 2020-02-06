import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { 
    userPublicProfile
} from '../../actions/user';
// Import config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import moment from 'moment';
import 'moment/locale/es';
import ContactForm from '../../components/form/ContactForm';

const UserProfile = ({ user, blogs, query }) => {

    // TODO: implementando algo de SEO
    const head = () => {
        return (
            <Head>
                <title>{user.username} { APP_NAME }</title>
                <meta name="descripción" content={`Blogs by ${user.name}`}/>
                <link rel="canonical" href={ `${DOMAIN}/profile/${query.username}` } />
                <meta property="og:title" content={`${user.username} | ${ APP_NAME }`} />
                <meta property="og:description" content={`Blogs by ${user.name}`} />
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={ `${DOMAIN}/profile/${query.username}` } />

                <meta property="og:site_name" content={ `${ APP_NAME }` }/>

                <meta property="og:image" content={`${DOMAIN}/static/images/memodevs.jpg`} />
                <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/memodevs.jpg`} />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="fb:app_id" content={ `${ FB_APP_ID }` }/>
            </Head>
        );
    }       

    const showUserBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div className="mt-4 mb-4" key={i}>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a className="lead">{blog.title}</a>
                    </Link>
                </div>
            );
        })
    }

    return (
        <React.Fragment>
            { head() }
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>{user.name}</h5>                                
                                            <p className="text-muted">Se unió { moment(user.createdAt).fromNow() }</p>                                            
                                        </div>
                                        <div className="col-md-4">
                                            <img 
                                                src={`${API}/user/photo/${user.username}`}
                                                className="rounded-circle float-right"
                                                style={{ maxWidth: '100px', height: '100px', width:'100px' }}
                                                alt="Perfil del usuario (Foto/Avatar)"
                                            />  
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="container pb-5">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pr-4 pl-4 text-light">
                                    Blogs recientes escritos por { user.name }
                                    </h5>                             
                                    <p>Blogs escritos:</p>
                                    {showUserBlogs()}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary pt-4 pb-4 pr-4 pl-4 text-light">
                                    Mensaje { user.name }
                                    </h5>
                                    <p>Formulario de contacto</p>                                
                                    <ContactForm authorEmail={user.email}/>
                                </div>
                            </div>
                        </div>                        
                    </div>
                </div>
            </Layout>
        </React.Fragment>
    );
}

UserProfile.getInitialProps = ({query}) => {
    return userPublicProfile(query.username).then( data => {
        if (data.error) {
            console.log(data.error)
        } else {
            console.log('GET PUBLIC PROFILE', data);
            return { user: data.user, blogs: data.blogs, query }
        }   
    })
}

export default UserProfile;
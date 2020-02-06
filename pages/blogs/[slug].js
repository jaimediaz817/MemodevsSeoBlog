import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { 
    singleBlog, 
    listRelatedBlog 
} from '../../actions/blog';
// Import config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import getInitialProps from './index';
import renderHTML from 'react-render-html';
import moment from 'moment';
import 'moment/locale/es';
import SmallCard from '../../components/blog/SmallCard';
// DISQUS
import DisqusThread from '../../components/disqus/DisqusThread';

const SingleBlog = ({ blog, query }) => {

    // DEFINICIONES HOOKS
    const [related, setRelated] = useState([]);

    const loadRelatedBlog = () => {
        listRelatedBlog({ blog }).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setRelated(data);
            }
        });
    }

    // HOOK - USE EFECT
    useEffect(() => {
        loadRelatedBlog();
    }, [])

    // TODO: implementando algo de SEO
    const head = () => {
        return (
            <Head>
                <title>{blog.title} { APP_NAME }</title>
                <meta name="descripción" content={blog.description}/>
                <link rel="canonical" href={ `${DOMAIN}/blogs/${query.slug}` } />
                <meta property="og:title" content={`${blog.title} | ${ APP_NAME }`} />
                <meta property="og:description" content={blog.desc} />
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={ `${DOMAIN}/blogs/${query.slug}` } />

                <meta property="og:site_name" content={ `${ APP_NAME }` }/>

                <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
                <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="fb:app_id" content={ `${ FB_APP_ID }` }/>
            </Head>
        );
    }    

    // Tags and Categories
    const showBlogCategories = blog => {
        return blog.categories.map((c, i) => {
            return (
                <Link key={ i } href={`/categories/${c.slug}`}>
                    <a className="btn btn-primary mr-1 ml-1 mt-3">{ c.name }</a>
                </Link>
            );
        })
    }

    const showBlogTags = blog => {        
        return blog.tags.map((t, i) => {
            return (
                <Link key={ i } href={`/tags/${t.slug}`}>
                    <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{ t.name }</a>
                </Link>
            );
        })
    }

    const showRelatedBlog = () => {
        return related.map((blog, i) => (
            <div className="col-md-4" key={ i } >
                <article>
                    <SmallCard blog={blog}/>
                </article>
            </div>
        ))
    }

    // DISQUS
    const showComments = () => {
        return (
            <div>
                <DisqusThread id={blog.id} title={blog.title} path={`/blog/${blog.slug}`} />
            </div>
        );
    }

    return (
        <React.Fragment>
            { head() }
            <Layout>
                <main>
                    <article>
                        <div className="container-fluid">
                            <section>
                                <div className="row" style={{ marginTop: '-30px'}}>
                                    <img 
                                        src={`${API}/blog/photo/${blog.slug}`}
                                        alt={blog.title}
                                        className="img img-fluid featured-image"
                                    />
                                </div>                                
                            </section>

                            <section>
                                <div className="container">
                                    <h1 className="display-2 pb-3 text-center font-weight-bold pt-3">{blog.title}</h1>
                                    <p className="lead mt-3 mark">
                                    Escrito por: 
                                        <Link href={`/profile/${blog.postedBy.username}`}>
                                            <a>{ blog.postedBy.username} | Publicado: {moment(blog.updatedAt).fromNow()}</a>
                                        </Link>
                                    </p>
                                    <div className="pb-3 text-center">
                                        <div>
                                            { showBlogCategories(blog) }
                                            { showBlogTags(blog) }
                                        </div>
                                        <br />
                                    </div>                                
                                </div>
                            </section>                            
                        </div>

                        <div className="container">
                            <section>
                                <div className="col-md-12 lead">
                                    { renderHTML(blog.body) }
                                </div>
                            </section>
                        </div>

                        <div className="container">
                            <h4 className="text-center pt-5 pb-5 h2">Blogs relacionados</h4>
                            <hr />
                            <p>mostrar los blogs relacionados</p>
                            { /*JSON.stringify(related)*/ }
                            <div className="row">
                            { showRelatedBlog() }
                            </div>                        
                        </div>

                        <div className="container pt-5 pb-5">
                            <p>mostrar comentarios</p>
                            {showComments()}
                        </div>

                        TEMPORAL:
                        <section>{JSON.stringify(query)}</section>
                        
                    </article>
                </main>
            </Layout>
        </React.Fragment>
    )
}

SingleBlog.getInitialProps = ({query}) => {
    return singleBlog(query.slug).then( data => {
        if (data.error) {
            console.log(data.error)
        } else {
            console.log('GET INITIAL PROPS IN SINGLE BLOG', data);
            return { blog: data, query }
        }   
    })
}

export default SingleBlog
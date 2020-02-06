import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags} from '../../actions/blog';
import Card from '../../components/blog/Card';
// Import config
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, size, router }) => {

    // TODO: implementando algo de SEO
    const head = () => {
        return (
            <Head>
                <title>Programando Blogs { APP_NAME }</title>
                <meta name="descripción" content="Programando blogs y tutoriales con React, Node, Next, Vue, Php y desarrollo web"/>
                <link rel="canonical" href={ `${DOMAIN}${router.pathname}` } />
                <meta property="og:title" content={`Ultimos tutoriales sobre desarrollo web | ${ APP_NAME }`} />
                <meta property="og:description" content="Programando blogs y tutoriales con React, Node, Next, Vue, Php y desarrollo web"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content={ `${DOMAIN}${router.pathname}` } />

                <meta property="og:site_name" content={ `${ APP_NAME }` }/>

                <meta property="og:image" content={`${DOMAIN}/static/images/memodevs.jpg`} />
                <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/memodevs.jpg`} />
                <meta property="og:image:type" content="image/jpg" />
                <meta property="fb:app_id" content={ `${ FB_APP_ID }` }/>
            </Head>
        );
    }    

    const loadMore = () => {
        let toSkip = skip + limit
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setSizeBlogs(data.size);
                setSkip(toSkip);
            }
        });
    }

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (<button onClick={loadMore} className="btn btn-outline-primary btn-lg">Cargar más</button>)
        );
    }

    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [sizeBlogs, setSizeBlogs] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const showAllCategories = () => {
        return categories.map((c, i) => (
            <Link href={`/categories/${ c.slug} `} key={ i }>                
                <a className="btn btn-primary mr-1 ml-1 mt-3">{ c.name}</a>
            </Link>
        ))
    }

    const showAllTags = () => {
        return tags.map((t, i) => (
            <Link href={`/tags/${ t.slug} `} key={ i }>                
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{ t.name}</a>
            </Link>
        ))
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return(
                <article key={ i }>
                    <Card blog={ blog } />
                    <hr />
                </article>
            );
        })
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => (
            <article key={ i }>
                <Card blog={blog} />
            </article>
        ))
    }

    return (
        <React.Fragment>
            { head() }
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">Programando Blogs y tutoriales</h1>
                            </div>
                            <section>
                                <p>Mostrar categorías y Tags</p>
                                <div className="pb-5 text-center">
                                    { showAllCategories() }
                                    <br />
                                    { showAllTags() }
                                </div>
                            </section>
                        </header>
                    </div>

                    <div className="container-fluid">
                        { /*JSON.stringify(blogs)*/ }
                        { showAllBlogs() }
                    </div>
                    <div className="container-fluid">
                        { showLoadedBlogs() }
                    </div>
                    <div className="text-center pt-5 pb-5">
                        { loadMoreButton() }
                    </div>                                                                            
                </main>
            </Layout>
        </React.Fragment>
    );
}

// 
Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;

    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogsSkip: skip,
                size: data.size,
            };
        }
        
    }).catch(err => console.log(err))
}

export default withRouter(Blogs); // getInitialProps

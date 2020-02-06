import React from 'react';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import 'moment/locale/es';
import { API } from '../../config';

const Card = ({ blog }) => {
    moment().locale('es');

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

    return (
        <div className="lead pb-4">
            <header>
                <Link href={ `/blogs/${blog.slug}` }>
                    <a>
                        <h2 className="display-5 pt-3 pb-3 font-weight">
                        { blog.title }
                        </h2>
                    </a>
                </Link>
            </header>
            <section className="">
                <p className="mark ml-1 pt-2 pb-2">
                    Escrito por 
                    <Link href={`/profile/${blog.postedBy.username}`}>
                        <a>{ blog.postedBy.username} | Publicado: {moment(blog.updatedAt).fromNow()}</a>
                    </Link>                    
                    { /*blog.postedBy.username } | Publicado {moment(blog.updatedAt).fromNow()*/ }
                </p>
            </section>
            <section>
                <div>
                    { showBlogCategories(blog) }
                </div>
                <div>
                    { showBlogTags(blog) }
                </div>
                <br />
            </section>

            <div className="row">
                <div className="col-md-4">
                    <img 
                        src={`${API}/blog/photo/${blog.slug}`}
                        style={{ maxHeight: '250px', width: '300px' }}
                        className="img-fluid rounded"
                        alt={blog.title}
                    />
                </div>
                <div className="col-md-8">
                    <section>
                        <div>
                            { renderHTML(blog.excerpt) }
                        </div>                                    
                        <Link href={ `/blogs/${blog.slug}` }>
                            <a className="btn btn-primary pt-2">Leer más</a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Card;

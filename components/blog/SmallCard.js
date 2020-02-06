import React from 'react';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import 'moment/locale/es';
import { API } from '../../config';

const SmallCard = ({ blog }) => {

    moment().locale('es');

    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                    <img 
                        src={`${API}/blog/photo/${blog.slug}`}
                        style={{ height: '250px', width: '100%' }}
                        className="img img-fluid"
                        alt={blog.title}
                    />                        
                    </a>
                </Link>
            </section>

            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title" >{blog.title}</h5>                        
                        </a>                        
                    </Link>
                    <p className="card-text">{ renderHTML(blog.excerpt)}</p>
                </section>
            </div>

            <div className="card-body">
                <Link href={ `/blogs/${blog.slug}` }>
                    <a className="pt-2">Leer más</a>
                </Link>
                <div>
                    Posteado: {moment(blog.updatedAt).fromNow} por: 
                    <i>
                    { blog.postedBy.username}
                    </i>
                    <Link href={ `/blogs/${blog.slug}` }>
                        <a className="float-right">{ blog.postedBy.name}</a>
                    </Link>                    
                </div>
            </div>
        </div>
    );
}

export default SmallCard;

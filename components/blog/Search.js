import React from 'react';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import {useState, useEffect} from 'react'
import 'moment/locale/es';
import { API } from '../../config';
import { listBlogsSearch } from '../../actions/blog';

const Search = () => {
    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    })

    const { search, results, searched, message} = values

    const searchSubmit = e => {
        e.preventDefault();
        listBlogsSearch({search}).then(data => {
            setValues({
                ...values,
                results: data, 
                searched: true,
                message: `Cantidad de Blogs encontrados :${data.length}`
            })
        });        
    }

    const handleChange = (e) => {
        console.log(e.target.value);
        setValues({
            ...values,
            search: e.target.value,
            searched: false,
            results: []
        })
    }

    const searchedBlogs = (results = []) => {
        return (
            <div className="jumbotron bg-white search-results">
                { message && <p className="pt-4 text-muted font-italic">{ message }</p>}
            
                { results.map((blog, i) => {
                    return (
                        <div key={i}>
                            <Link href={`/blogs/${blog.slug}`}>
                                <a className="text-primary">{ blog.title }</a>
                            </Link>
                        </div>
                    )
                })}      
            </div>        
        );
    }

    const searchForm = () => {
        return (
            <form onSubmit={ searchSubmit }>
                <div className="row">
                    <div className="col-md-8">
                        <input 
                            type="search"
                            className="form-control"
                            placeholder="Search Blogs"
                            onChange={ handleChange }
                        />
                    </div>

                    <div className="col-md-4">
                        <button 
                            className="btn btn-block btn-outline-primary"
                            type="submit"
                        >
                        Buscar Blogs
                        </button>
                    </div>                    
                </div>
            </form>
        );
    }

    return (
        <div className="container-fluid">
            <div className="pt-3 pb-5 form-search-container">
            {searchForm()}
            </div>            
            { searched && <div className="result-container" style={{ marginTop:'-120px', marginBottom:'-80px'}}>{ searchedBlogs(results) }</div>}        
        </div>
    );
}

export default Search;

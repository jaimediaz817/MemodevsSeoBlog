import React from 'react';

const SingleLoader = ({loading, withText}) => {

    // Logic...
    const showLoader = () => (
        loading ? (
            <div class="text-center single-loader-container">
                <div className="spinner-border text-success single-loader-v1" style={{ width: '3rem', height: '3rem', position: 'fixed', top: '50%', left: '50%' }}>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ) : ''   
    );

    return (
        <React.Fragment>
            { showLoader() }
        </React.Fragment>
    );
}

export default SingleLoader;

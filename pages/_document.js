// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

class MyDocument extends Document {

    setGoogleTags() {    
        if(publicRuntimeConfig.PRODUCTION) {
            return{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());            
                  gtag('config', 'UA-157854001-1');
                `
            };
        }
    }

    render() {
        return (
            <Html lang="es">
                <Head>

                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <link 
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
                    />
                    { /*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" /> */ }
                    <link rel="stylesheet" href="/static/css/styles.css" />

                    {/* GOOGLE ANALYTICS */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-157854001-1"></script>                    
                    <script dangerouslySetInnerHTML={ this.setGoogleTags() }></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;
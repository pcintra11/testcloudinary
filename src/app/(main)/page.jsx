'use client'

import { useState } from 'react';
import Head from 'next/head';

import UploadWidget from './UploadWidget';
import { dummy1 } from './bigScript1';
import { dummy2 } from './bigScript2';
import { dummy3 } from './bigScript3';
import { dummy4 } from './bigScript4';
import { dummy5 } from './bigScript5';
import { dummy6 } from './bigScript6';
import { dummy7 } from './bigScript7';
import { dummy8 } from './bigScript8';

//import styles from '../styles/Home.module.css';
const styles = {};

export default function Home() {
  const [url, updateUrl] = useState();
  const [error, updateError] = useState();

  /**
   * handleOnUpload
   */

  function handleOnUpload(error, result, widget) {
    if (error != null) console.log('handleOnUpload cb error', error);
    else console.log('handleOnUpload cb event', result.event);
    if ( error ) {
      updateError(error);
      widget.close({
        quiet: true
      });
      return;
    }
    updateUrl(result?.info?.secure_url);
  }
  
  dummy1();
  // dummy2();
  // dummy3();
  // dummy4();
  // dummy5();
  // dummy6();
  // dummy7();
  // dummy8();

  return (
    <>
      <Head>
        <title>Next.js &amp; Cloudinary Upload Widget</title>
        <meta name="description" content="Find more Cloudinary examples at github.com/colbyfayock/cloudinary-examples" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Next.js &amp; Cloudinary Upload Widget v8 (bigScripts + logs + same as vizinet)
          </h1>
        </div>

        <div className={styles.container}>
          <blockquote className={styles.warning}>
            Note: See <a href="https://next-cloudinary.spacejelly.dev/">Next Cloudinary</a> for
            first-class Next.js support of the Cloudinary Upload Widget.
          </blockquote>
        </div>

        <div className={styles.container}>
          <UploadWidget onUpload={handleOnUpload}>
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return (
                <button onClick={handleOnClick}>
                  Upload an Image
                </button>
              )
            }}
          </UploadWidget>

          {error?.statusText && <p><strong>Error:</strong> { error.statusText }</p>}

          {url && (
            <>
              <p><img src={ url } alt="Uploaded image" /></p>
              <p>{ url }</p>
            </>
          )}
        </div>

      </main>
    </>
  )
}
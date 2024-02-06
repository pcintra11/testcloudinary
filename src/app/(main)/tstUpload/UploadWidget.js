import Script from 'next/script';
import { useEffect, useRef } from 'react';

//import { generateSignature } from '@/techno_cloudinary/client/util';
import { clc, generateSignature } from '../complement';

import { Env } from '../envs';
// import { clc } from '@/libs/client/util';

let cloudinary;

const UploadWidget = ({ children, onUpload, params }) => {
  const widget = useRef();

  useEffect(() => {
    clc('effect');
    return () => {
      widget.current?.destroy();
      widget.current = undefined;
    }
  }, [])

  /**
   * handleOnLoad
   * @description Stores the Cloudinary window instance to a ref when the widget script loads
   */

  function handleOnLoad(scriptOk) {
    clc('handleOnLoad, script ready:', scriptOk);
    if (!scriptOk) {
      clc('erro na carga do script cloudinary');
      return;
    }

    if (!cloudinary) {
      cloudinary = window.cloudinary;
    }

    // To help improve load time of the widget on first instance, use requestIdleCallback
    // to trigger widget creation. If requestIdleCallback isn't supported, fall back to
    // setTimeout: https://caniuse.com/requestidlecallback

    function onIdle() {
      if (!widget.current) {
        clc('createWidget start');
        widget.current = createWidget();
        clc('createWidget end');
      }
    }

    'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);
  }

  /**
   * createWidget
   * @description Creates a new instance of the Cloudinary widget and stores in a ref
   */

  function createWidget() {
    // When creating a signed upload, you need to provide both your Cloudinary API Key
    // as well as a signature generator function that will sign any paramters
    // either on page load or during the upload process. Read more about signed uploads at:
    // https://cloudinary.com/documentation/upload_widget#signed_uploads

    const cloudName = 'pcintra';
    const apiKey = Env('cloudinaryApiKey');

    if (!cloudName || !apiKey) {
      console.warn(`Kindly ensure you have the cloudName and apiKey 
      setup in your .env file at the root of your project.`)
    }

    function uploadSignature(callback, paramsToSign) {
      generateSignature(paramsToSign)
        .then((signature) => {
          callback({ signature })
        });
    }

    const options = {
      cloudName, // Ex: mycloudname
      apiKey, // Ex: 1234567890
      uploadSignature,
      ...params,
    }

    return cloudinary?.createUploadWidget(options,
      function (error, result) {
        if (error != null) clc('createUploadWidget cb error', error);
        else clc('createUploadWidget cb event', result.event);
        // The callback is a bit more chatty than failed or success so
        // only trigger when one of those are the case. You can additionally
        // create a separate handler such as onEvent and trigger it on
        // ever occurance
        if ((error || result.event === 'success') && typeof onUpload === 'function') {
          onUpload(error, result, widget);
        }
      }
    );
  }

  /**
   * open
   * @description When triggered, uses the current widget instance to open the upload modal
   */
  function open() {
    clc('open');
    if (!widget.current) {
      widget.current = createWidget();
    }
    widget.current && widget.current.open();
  }

  return (
    <>
      {children({ cloudinary, widget, open })}
      <Script id="cloudinary" src="https://widget.cloudinary.com/v2.0/global/all.js"
        onLoad={() => clc('cloudinary script load')}
        onReady={() => handleOnLoad(true)}
        onError={() => handleOnLoad(false)}
      />
    </>
  )
}

export default UploadWidget;
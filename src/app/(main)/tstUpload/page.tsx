'use client'

import React from 'react';
import Head from 'next/head';
import { Box, Button, Input, Stack } from '@mui/material';

import { CloudinaryUploadFile, IUploadParams } from '../complement';

import { clc } from '../complement';
//import { ImgResponsive, Tx, WaitingObs } from '@/libs/client/components';

import UploadWidget from './UploadWidget';

const styles: any = {};

export default function Home() {
  const [error, updateError] = React.useState<any>();
  const [uploading, setUploading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const inputFileRef = React.useRef<HTMLInputElement>();

  let xx = 'xxxx'; // eslint não reclamou const!!!!!!!!!!! nem que não foi utilizada

  /**
   * handleOnUpload
   */

  function handleOnUpload1(error, result, widget) {
    if (error != null) clc('handleOnUpload1 cb error', error);
    else clc('handleOnUpload1 cb event', result.event);
    if (error) {
      updateError(error.statusText);
      widget.close({
        quiet: true
      });
      return;
    }
    clc('result', result);
    setImageUrl(result?.info?.secure_url);
  }

  function handleOnUpload2(error, result) {
    if (error) {
      updateError(error.message);
      return;
    }

    clc('handleOnUpload2 cb event', result.event);
    if (result.event == 'start') { setUploading(true); return; }
    if (result.event == 'finish') { setUploading(false); return; }

    clc('result', result);
    setImageUrl(result?.data?.secure_url);
  }

  // const onChange = async (e) => {
  //   const formData = new FormData();
  //   formData.append('file', e.target.files[0]);
  //   formData.append('upload_preset', 'testes');
  //   formData.append('folder', 'testes');
  //   formData.append('public_id', 'teste02');
  //   try {
  //     const url = cloudinaryUrl('image');
  //     console.log('ini upload');
  //     const res = await fetch(url, {
  //       method: 'POST',
  //       body: formData
  //     })
  //     console.log('res', res);
  //     const data = await res.json();
  //     console.log('end upload', data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const agora = new Date();

  // const paramsUploadUnsigned: IUploadParams = {
  //   upload_preset: 'testes',
  //   folder: 'testes',
  //   //public_id: `${agora.getTime()}-unsigned`,
  //   public_id: 'file2',
  //   tags: ['teste', 'unsigned'],
  //   context: 'user=user1|type=avatarU',
  // };
  const paramsUploadSigned: IUploadParams = {
    upload_preset: 'avatar',
    folder: 'testes',
    public_id: 'file1',
    timestamp: agora.getTime(),
    tags: ['teste', 'signed'],
    context: 'user=user1|type=avatarS',
  };

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
            Next.js &amp; Cloudinary Upload Widget (same page in two apps)
          </h1>
        </div>

        <div className={styles.container}>
          <blockquote className={styles.warning}>
            Note: See <a href="https://next-cloudinary.spacejelly.dev/">Next Cloudinary</a> for
            first-class Next.js support of the Cloudinary Upload Widget.
          </blockquote>
        </div>

        <div className={styles.container}>
          <UploadWidget onUpload={handleOnUpload1} params={paramsUploadSigned}>
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return (
                <button onClick={handleOnClick}>
                  Upload widget signed
                </button>
              )
            }}
          </UploadWidget>
        </div>

        <br />
        <hr />
        <br />
        <div>Without widget</div>
        <br />

        <Stack spacing={1}>

          <Stack direction='row' rowGap={3} spacing={1}>
            {/* <Box>
              <CloudinaryUploadSimple onUpload={handleOnUpload2} signed={false} params={paramsUploadUnsigned} text='unsigned simple' />
            </Box> */}
            {/* <Box>
              <CloudinaryUploadSimple onUpload={handleOnUpload2} signed={true} params={paramsUploadSigned} text='signed simple' />
            </Box> */}
            <Box>
              <Button variant='contained' onClick={() => inputFileRef.current?.click()}>Signed simple</Button>
              <Input type='file' sx={{ display: 'none' }} inputRef={inputFileRef} value='' onChange={(ev: any) => CloudinaryUploadFile(ev.target.files[0], true, paramsUploadSigned, handleOnUpload2)} />
            </Box>
          </Stack>

          {/* {uploading && <WaitingObs text={null} />} */}

          {error != null && <p><strong>Error:</strong> {error}</p>}

          {imageUrl != null &&
            <>
              <div>{imageUrl}</div>
              <img src={imageUrl} alt="Uploaded image" />
            </>
          }
        </Stack>
      </main>
    </>
  )
}
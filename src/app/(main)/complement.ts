import React from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

export interface IUploadParams {
  folder: string;
  public_id: string;
  timestamp?: number;
  upload_preset: string;
  tags?: string[];
  context?: string;

  // ocr: 'adv_ocr', //@!!!!!!!!!!!!
  // moderation: 'aws_rek', // rejeitar se conteudo adulto

  // Unsigned requests are restricted to the following allowed parameters: public_id, folder, callback, tags, context, face_coordinates (images only), 
  // custom_coordinates (images only), regions (images only) and upload_preset. Most of the other upload parameters can be defined in your upload_preset.
}
export const CloudinaryUploadFile = async (file: any, signed: boolean, params: IUploadParams, onUpload: (error, result) => void) => {
  try {
    //clc('CloudinaryUploadFile ini');
    onUpload(null, { event: 'start' });
    const formData = new FormData();
    formData.append('file', file);
    for (const prop in params) formData.append(prop, params[prop]);

    if (signed) {
      const api_key = '685529774363572';
      //clc('CloudinaryUploadFile generateSignature');
      const signature = await generateSignature(params);
      formData.append('api_key', api_key);
      formData.append('signature', signature);
    }

    //clc('CloudinaryUploadFile cloudinaryUrl/upload');
    //await SleepMs(3000);
    const res = await fetch(cloudinaryUrl('image'), {
      method: 'POST',
      body: formData,  //@!!!!!!!!!!!!!!7 preparar fetcher para outros tipos de body !
    })
    onUpload(null, { event: 'finish' });
    if (res.status != 200) throw new Error(res.statusText); //@!!!!!!!!!!!7 ver fetcher

    const data = await res.json();
    //clc('CloudinaryUploadFile end', data);
    onUpload(null, { event: 'ok', data });
  } catch (error) {
    onUpload(error, null);
  }
}

export const cloudinaryUrl = (resourceType: string) => `https://api.cloudinary.com/v1_1/pcintra/${resourceType}/upload`;

export async function generateSignature(paramsToSign) {
  const res = await fetch(`/apis/appBase/cloudinarySignature`, {
    method: 'POST',
    body: JSON.stringify({
      paramsToSign
    })
  });
  const result = await res.json();
  const { value } = result;
  return value.signature;
}

export function clc(...params) { // uso temporário!!!
  console.log(...params);
}

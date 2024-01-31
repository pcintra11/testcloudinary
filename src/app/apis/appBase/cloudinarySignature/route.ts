import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { EnvSvr } from '../../../../appBase/commom/envs';

export async function POST(req: NextRequest) {
  try {
    const parm = await req.json() as any;
    const signature = cloudinary.utils.api_sign_request(parm.paramsToSign, EnvSvr('cloudinaryApiSecret'));
    //console.log({ parm, signature });
    return NextResponse.json(
      { value: { signature } },
      { status: 200 }
    );
  }
  catch (error) {
    console.log('parm invalido');
  }
};

type EnvName = 'cloudinaryApiKey'

export function Env(envName: EnvName, suffix?: string) {
  let value = '';
  let valueAux: string | undefined = undefined;

  try {
    if (envName == 'cloudinaryApiKey') valueAux = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    else
      throw new Error('Variável não prevista');

    if (valueAux == null)
      throw new Error('Valor obrigatório');

    value = valueAux;
  } catch (error) {
    throw new Error(`Env(${envName}), value: ${valueAux}: ${error.message}`);
  }
  if (suffix == null)
    return value;
  else
    return `${value}_${suffix}`;
}

type EnvNameSvr = 'cloudinaryApiSecret';
export function EnvSvr(envName: EnvNameSvr) {
  let value = '';
  try {
    let valueAux: string | undefined = undefined;
    if (envName == 'cloudinaryApiSecret') valueAux = process.env.SITE_CLOUDINARY_API_SECRET;
    else throw new Error('Variável não prevista');
    if (valueAux != null)
      value = valueAux;
    else
      if ((envName == 'cloudinaryApiSecret')) throw new Error('Variável obrigatória');
  } catch (error) {
    throw new Error(`EnvSvr(${envName}), value: ${value}: ${error.message}`);
  }
  return value;
}
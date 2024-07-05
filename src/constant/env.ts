export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';
const isShow = process.env.NEXT_PUBLIC_SHOW_LOGGER || 'false';
export const showLogger = isLocal ? true : isShow === 'true' ?? false;

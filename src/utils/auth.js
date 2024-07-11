// utils/auth.js

import Cookies from 'js-cookie';
import { setCookie, destroyCookie } from 'next-cookies';

const TOKEN_NAME = 'token';

export const setTokenCookie = (token) => {
  Cookies.set(TOKEN_NAME, token, { expires: 1 }); // Simpan token di cookie dengan masa berlaku 1 hari
};

export const getTokenCookie = (ctx) => {
  return process.browser ? Cookies.get(TOKEN_NAME) : getServerTokenCookie(ctx);
};

export const removeTokenCookie = () => {
  Cookies.remove(TOKEN_NAME);
};

const getServerTokenCookie = (ctx) => {
  const token = getCookieFromServer(ctx, TOKEN_NAME);
  return token;
};

const getCookieFromServer = (ctx, cookieName) => {
  const cookie = ctx.req.headers.cookie;
  if (!cookie) {
    return undefined;
  }
  const cookieValue = cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${cookieName}=`));
  if (!cookieValue) {
    return undefined;
  }
  return cookieValue.split('=')[1];
};

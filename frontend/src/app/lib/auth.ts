let accessToken: string | null = null;
let refreshToken: string | null = null;

export const auth = {
  set: (a: string, r: string) => { accessToken = a; refreshToken = r; },
  clear: () => { accessToken = null; refreshToken = null; },
  access: () => accessToken,
  refresh: () => refreshToken,
};

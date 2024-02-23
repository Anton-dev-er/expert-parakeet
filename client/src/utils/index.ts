const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let BASE_URL: string;
const env = (process.env.NEXT_PUBLIC_ENV || '').trim();
if (env === 'dev') {
  BASE_URL = 'http://localhost:5555';
} else if (env === 'prod') {
  BASE_URL = 'https://watchy-444444.lm.r.appspot.com';
} else {
  BASE_URL = 'https://watchy-444444.lm.r.appspot.com';
}

export { sleep, BASE_URL };

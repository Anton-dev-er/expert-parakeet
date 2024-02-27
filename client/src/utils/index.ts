const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let BASE_URL: string;
const env = process.env.NODE_ENV;

console.log('env:', env);

if (env === 'development') {
  BASE_URL = 'http://localhost:5555';
} else if (env === 'production') {
  BASE_URL = 'https://watchy-444444.lm.r.appspot.com';
} else {
  BASE_URL = 'https://watchy-444444.lm.r.appspot.com';
}


export { sleep, BASE_URL };

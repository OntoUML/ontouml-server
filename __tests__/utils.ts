import axios from 'axios';
import customEnv from 'custom-env';

customEnv.env('test', './');

const TIMEOUT = 300000;

export const axiosInstance = axios.create({
  baseURL: 'localhost',
  timeout: TIMEOUT,
});

export const post = (url, data) => axios.post(url, data, { timeout: TIMEOUT });

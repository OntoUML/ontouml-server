import express from 'express';
import bodyParser from 'body-parser';
import ontoumlRoutes from '@routes/ontouml';
import notFoundRouter from '@routes/not_found';
import errorRouter from '@routes/error';
import { API_VERSION } from '@configs/index';

const app = express();

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(API_VERSION, ontoumlRoutes);

app.use(notFoundRouter);
app.use(errorRouter);

app.listen(8888);

console.log('API is running on port 8888');

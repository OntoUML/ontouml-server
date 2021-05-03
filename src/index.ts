import express from 'express';
import notFoundRouter from '@routes/not_found';
import errorRouter from '@routes/error';
import verifyRouter from '@routes/verify';
import modularizeRouter from '@routes/modularize';
import transformGufoRouter from '@routes/transform.gufo';
import transformDbRouter from '@routes/transform.db';
import { API_VERSION } from '@configs/index';
import http from 'http';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.log(err);

    return res.status(400).send({
      status: 400,
      // error: err,
    });
  }

  next();
});

app.use(`${API_VERSION}/verify`, verifyRouter);
app.use(`${API_VERSION}/transform/gufo`, transformGufoRouter);
app.use(`${API_VERSION}/transform/db`, transformDbRouter);
app.use(`${API_VERSION}/modularize`, modularizeRouter);
app.use(notFoundRouter);
app.use(errorRouter);

http.createServer(app).listen(port);

console.log(`API is running on port ${port}`);

import express from 'express';
import ontoumlRoutes from '@routes/ontouml';
import notFoundRouter from '@routes/not_found';
import errorRouter from '@routes/error';
import { API_VERSION } from '@configs/index';
import http from 'http';
import bodyParser from 'body-parser';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
// const port = 80;

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.log(err);
    
    return res.status(400).send({
      status: 400,
      error: err,
    });
  }

  next();
});

app.use(API_VERSION, ontoumlRoutes);

app.use(notFoundRouter);
app.use(errorRouter);

// app.listen(port);
http.createServer(app).listen(port);

console.log(`API is running on port ${port}`);

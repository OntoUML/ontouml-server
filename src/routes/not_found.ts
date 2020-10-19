import express from 'express';
import NotFoundError from '@error/not_found';

export default function(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!req.app.locals.error) {
    const error = new NotFoundError({
      status: 404,
      message: 'Not found',
    });

    req.app.locals.error = error;
    res.app.locals.error = error;
  }

  next();
}

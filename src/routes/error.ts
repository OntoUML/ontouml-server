import express from 'express';

export default function(req: express.Request, res: express.Response) {
  const { error } = req.app.locals;

  res.status(error.status).json(error);
}

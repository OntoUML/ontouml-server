import express from 'express';
import { OntoUMLModel } from 'ontouml-js';
import BadRequestError from '@error/bad_request';

const router = express.Router();

/**
 * @api {post} /verification 1. Verification
 * @apiVersion 0.1.0
 * @apiName Verification
 * @apiGroup OntoUML
 * @apiDescription Syntax verification for ontouml models
 *
 * @apiExample {curl} curl
 *   curl https://api.ontouml.org/v1/verification
 *
 * @apiExample {node} node
 *   const { OntoUMLModel } = require('ontouml-js');
 *
 *   const model = new OntoUMLModel(jsonModel);
 *   model.verify();
 *
 */
router.post(
  '/verification',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const model = new OntoUMLModel(req.body);

    const errors = await model.verify();

    if (errors.length > 0) {
      req.app.locals.error = new BadRequestError({
        title: 'Invalid model',
        detail: 'The model is not valid OntoUML model',
        meta: errors,
      });

      next();
    } else {
      res.send({ valid: true });
    }
  },
);

export default router;

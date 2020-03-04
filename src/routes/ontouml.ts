import express from 'express';
// import { OntoUMLModel } from 'ontouml-js';
import {
  ModelManager,
  OntoUML2Verification,
  OntoUML2GUFO,
  VerificationIssue,
} from 'ontouml-js';
// import BadRequestError from '@error/bad_request';

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
  '/verify',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    let modelManager: ModelManager;
    let verification: OntoUML2Verification;

    try {
      modelManager = new ModelManager(req.body);
      verification = new OntoUML2Verification(modelManager);
      const issues: VerificationIssue[] = await verification.run();

      // console.log(issues);

      if (issues && issues.length > 0) {
        res.status(200);
        res.json(JSON.parse(JSON.stringify(issues, replacer)));
      } else {
        res.status(200);
        res.json([]);
      }
    } catch (exception) {
      if (exception.message === 'Invalid model input.') {
        res.status(400);
        res.json({
          status: '400',
          message: exception.message,
          errors: exception.errors,
        });
      } else {
        res.status(500).send();
        console.trace(exception);
      }
    }
  },
);

router.post(
  '/transform/gufo',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    let modelManager: ModelManager;
    let service: OntoUML2GUFO;

    try {
      const model = req.body.model;
      const options = req.body.options;

      modelManager = new ModelManager(model);
      service = new OntoUML2GUFO(modelManager);
      const output = await service.transformOntoUML2GUFO(options);

      res.status(200);
      if (options.format === 'N-Triples') {
        res.type('application/n-triples');
      } else if (options.format === 'N-Quads') {
        res.type('application/n-quads');
      } else if (options.format === 'Turtle') {
        res.type('text/turtle');
      } else {
        res.type('text');
      }
      res.send(output);
    } catch (exception) {
      if (exception.message === 'Invalid model input.') {
        res.status(400);
        res.json({
          status: '400',
          message: exception.message,
          errors: exception.errors,
        });
      } else {
        res.status(500).send();
        console.trace(exception);
      }
    }
  },
);

// TODO: change this replacer
function replacer(key, value) {
  if (key.startsWith('_')) {
    return undefined;
  }

  if (this.type) {
    let contentsFields = [];

    switch (this.type) {
      case 'Package':
        contentsFields = ['contents'];
        break;
      case 'Class':
        contentsFields = ['properties', 'literals'];
        break;
      case 'Relation':
        contentsFields = ['properties'];
        break;
      case 'Literal':
        break;
      case 'Property':
        break;
      case 'Generalization':
        break;
      case 'GeneralizationSet':
        // contentsFields = ['generalizations'];
        break;
    }

    if (
      !contentsFields.includes(key) &&
      key !== 'stereotypes' &&
      Array.isArray(value)
    ) {
      return value.map(item =>
        item.id && item.type ? { id: item.id, type: item.type } : value,
      );
    } else if (
      !contentsFields.includes(key) &&
      key !== 'stereotypes' &&
      value instanceof Object
    ) {
      return value.id && value.type
        ? { id: value.id, type: value.type }
        : value;
    }
  }

  return value;
}

export default router;

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

router.post(
  '/verify',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    let modelManager: ModelManager;
    let verification: OntoUML2Verification;
    let issues: VerificationIssue[];
    let issuesString: string;

    try {
      modelManager = new ModelManager(req.body);
    } catch (deserializationError) {
      let status: number = 500;
      let message: string;
      let errors: any;

      if (deserializationError.message === 'Invalid model input.') {
        status = 400;
        message = deserializationError.message;
        errors = deserializationError.errors;
      } else {
        status = 500;
        message = 'Model manipulation error';
        errors = deserializationError;
      }

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
    }

    try {
      verification = new OntoUML2Verification(modelManager);
      issues = await verification.run();
      issues = JSON.parse(JSON.stringify(issues, replacer));
    } catch (verificationError) {
      let status: number = 500;
      let message: string = 'Model verification error';
      let errors: any = verificationError;

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
    }

    try {
      if (issues && issues.length > 0) {
        res.status(200);
        res.json(issues);
      } else {
        res.status(200);
        res.json([]);
      }
    } catch (responseError) {
      let status: number = 500;
      let message: string = 'Response error';
      let errors: any = responseError;

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
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
    let verification: OntoUML2Verification;
    let service: OntoUML2GUFO;

    if (
      !req.body ||
      !req.body.model ||
      !req.body.options ||
      !req.body.options.baseIRI ||
      !req.body.options.format ||
      !req.body.options.uriFormatBy
    ) {
      res.status(400).send({
        status: 400,
        message: 'Malformed request',
      });
      return;
    }

    const model = req.body.model;
    const options = req.body.options;

    try {
      modelManager = new ModelManager(model);
    } catch (deserializationError) {
      let status: number = 500;
      let message: string;
      let errors: any;

      if (deserializationError.message === 'Invalid model input.') {
        status = 400;
        message = deserializationError.message;
        errors = deserializationError.errors;
      } else {
        status = 500;
        message = 'Model manipulation error';
        errors = deserializationError;
      }

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
    }

    try {
      verification = new OntoUML2Verification(modelManager);
      const issues: VerificationIssue[] = await verification.run();
      const errorIssues: VerificationIssue[] = issues
        ? issues.filter(
            (issue: VerificationIssue) => issue.severity === 'ERROR',
          )
        : [];

      if (errorIssues.length > 0) {
        res.status(400);
        res.json({
          status: 400,
          message: 'Unable to transform model containing errors',
          errors: JSON.parse(JSON.stringify(errorIssues, replacer)),
        });
        return;
      }
    } catch (verificationError) {
      let status: number = 500;
      let message: string = 'Verification step error';
      let errors: any = verificationError;

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
    }

    try {
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
    } catch (transformationError) {
      let status: number = 500;
      let message: string = 'Transformation step error';
      let errors: any = transformationError;

      res.status(status);
      res.json({
        status: status,
        message: message,
        errors: errors,
      });
      return;
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

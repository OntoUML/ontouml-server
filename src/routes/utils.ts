import express from 'express';
import uniqid from 'uniqid';
import { Project, OntoumlVerification, serializationUtils, VerificationIssue, ServiceIssueSeverity } from 'ontouml-js';

export function parseRequestBody(request: express.Request): { project: Project; options: any; issues: any[] } {
  try {
    const { body } = request;
    const projectCopy = JSON.stringify(body.project);
    const project: Project = body.project ? serializationUtils.parse(projectCopy, true) : null;
    const options = body.options;

    if (!project) {
      throw new ParseError();
    }

    return { project, options, issues: null };
  } catch (error) {
    let validationOutput;
    try {
      validationOutput = serializationUtils.validate(JSON.stringify(request.body.project));
    } catch (validationError) {
      console.error('Unable to validate input');
    }

    if (validationOutput !== true) {
      throw new ParseError(validationOutput);
    } else {
      throw new ParseError();
    }
  }
}

export class ParseError extends Error {
  info: any;

  constructor(info?: any) {
    super();
    this.message = 'The input could not be parse into a valid instance of Project.';
    this.info = info;
  }
}

export function parseErrorResponse(_request: express.Request, response: express.Response, error: ParseError): void {
  const errorId = uniqid();
  const responseBody = {
    id: errorId,
    status: 400,
    message: error.message,
    info: error.info,
  };

  console.error(`${errorId} - Request input could not be parsed`);
  console.error(error.stack);
  console.error(responseBody);

  response.status(400).json(responseBody);
}

export function containSyntacticalErrors(verificationOutput) {
  if (Array.isArray(verificationOutput && verificationOutput.result)) {
    return verificationOutput.result.some((issue: VerificationIssue) => issue.severity === ServiceIssueSeverity.ERROR);
  }
  return false;
}

export function unableToProcessProjectWithErrorsResponse(
  _request: express.Request,
  response: express.Response,
  verificationOutput,
): void {
  const errorId = uniqid();
  console.error(`${errorId} - Unable to process project containing syntactical errors`);
  console.error(verificationOutput.result);
  console.log(`------------------------------------`);

  response.status(400).json({
    id: errorId,
    status: 400,
    message: 'Unable to process project containing syntactical errors',
    info: verificationOutput.result,
  });
}

export function performVerification(project: Project, options: any): any {
  const service = new OntoumlVerification(project, options);
  return service.run();
}

export function logRequestConcluded(statusCode) {
  console.log(
    `[${new Date().toISOString()}] - Request concluded${typeof statusCode === 'number' ? ' with status code ' + statusCode : ''}`,
  );
  console.log(`------------------------------------`);
}

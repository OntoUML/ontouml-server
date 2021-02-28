import express from 'express';
import uniqid from 'uniqid';
import {
  parseRequestBody,
  ParseError,
  parseErrorResponse,
  containSyntacticalErrors,
  unableToProcessProjectWithErrorsResponse,
  performVerification,
} from './utils';
import { Project, Modularizer } from 'ontouml-js';

export default async function(request: express.Request, response: express.Response, _next: express.NextFunction) {
  try {
    logTransformationRequest(request);

    const { project, options } = parseRequestBody(request);
    let output = performVerification(project, options);

    if (containSyntacticalErrors(output)) {
      unableToProcessProjectWithErrorsResponse(request, response, output);
    } else {
      output = performModularization(project, options);
      response.status(200).json(output);
    }
  } catch (error) {
    if (error instanceof ParseError) {
      parseErrorResponse(request, response, error);
    } else {
      unexpectedTransformationErrorResponse(request, response, error);
    }
  }
}

function performModularization(project: Project, options: any): any {
  const service = new Modularizer(project, options);
  return service.run();
}

function logTransformationRequest(request: express.Request): void {
  console.log(`------------------------------------`);
  console.log(`[${new Date().toISOString()}] - Processing modularization request`);
  console.log(`\tIP: ${request.ip}`);
  console.log(`\tProject ID: ${request.body.project ? request.body.project.id : 'Unavailable'}`);
  console.log(`\tOptions: ${request.body.options}`);
}

function unexpectedTransformationErrorResponse(_request: express.Request, response: express.Response, error: any): void {
  const errorId = uniqid();
  const responseBody = {
    id: errorId,
    status: 500,
    message: 'Internal server error',
  };

  console.error(`${errorId} - An unexpected error occurred during modularization`);
  console.error(error.stack);
  console.error(responseBody);

  response.status(500).json(responseBody);
}

import express from 'express';
import uniqid from 'uniqid';
import { parseRequestBody, performVerification, ParseError, parseErrorResponse } from './utils';

export default async function(request: express.Request, response: express.Response, _next: express.NextFunction) {
  try {
    logVerificationRequest(request);

    const { project, options } = parseRequestBody(request);
    const output = performVerification(project, options);
    response.status(200).json(output);
  } catch (error) {
    if (error instanceof ParseError) {
      parseErrorResponse(request, response, error);
    } else {
      unexpectedVerificationErrorResponse(request, response, error);
    }
  }
}

function logVerificationRequest(request: express.Request): void {
  console.log(`------------------------------------`);
  console.log(`[${new Date().toISOString()}] - Processing verification request`);
  console.log(`\tIP: ${request.ip}`);
  console.log(`\tProject ID: ${request.body.project ? request.body.project.id : 'Unavailable'}`);
  console.log(`\tOptions: ${request.body.options}`);
}

function unexpectedVerificationErrorResponse(_request: express.Request, response: express.Response, error: any): void {
  const errorId = uniqid();
  const responseBody = {
    id: errorId,
    status: 500,
    message: 'Internal server error',
  };

  console.error(`${errorId} - An unexpected error occurred during model verification`);
  console.error(error.stack);
  console.error(responseBody);

  response.status(500).json(responseBody);
}

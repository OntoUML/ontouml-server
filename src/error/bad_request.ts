import Error from './error';

class BadRequestError extends Error {
  constructor(raw: any) {
    const { title, detail, meta } = raw;

    super({
      title,
      detail,
      meta,
      status: 400,
      code: 'bad_request_error',
    });
  }
}

export default BadRequestError;

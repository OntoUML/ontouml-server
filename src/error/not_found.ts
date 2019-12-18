import Error from './error';

class NotFoundError extends Error {
  constructor(raw: any) {
    const { title, detail, meta } = raw;

    super({
      title,
      detail,
      meta,
      status: 404,
      code: 'not_found_error',
    });
  }
}

export default NotFoundError;

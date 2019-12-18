class Error {
  status: any;
  code: any;
  title: any;
  detail: any;
  meta: any;
  timestamp: number;

  constructor(raw: any) {
    const { status, code, title, detail, meta } = raw;

    this.status = status;
    this.code = code;
    this.title = title;
    this.detail = detail;
    this.meta = meta;
    this.timestamp = new Date().getTime();
  }

  send() {
    const { code, title, detail, meta } = this;

    return {
      code,
      title,
      detail,
      meta,
    };
  }
}

export default Error;

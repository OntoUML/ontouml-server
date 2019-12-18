interface IError {
  status: number;
  code: string;
  title: string;
  detail: string;
  meta?: object;
}

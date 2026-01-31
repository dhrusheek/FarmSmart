export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const badRequest = (message: string) => new HttpError(400, message);
export const unauthorized = (message: string = 'Unauthorized') => new HttpError(401, message);
export const forbidden = (message: string = 'Forbidden') => new HttpError(403, message);
export const notFound = (message: string = 'Not found') => new HttpError(404, message);

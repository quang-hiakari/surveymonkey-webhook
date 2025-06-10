import { Response, Request } from 'express';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

type HandleError = {
  code: string;
  message: string;
};

export interface TypedResponseBody<T> {
  result?: T;
  errors?: HandleError[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TypedResponse<T> extends Response<TypedResponseBody<T>> {}
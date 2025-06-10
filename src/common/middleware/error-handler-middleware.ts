import { Request, Response, NextFunction } from 'express';

// Type define
type ErrorPayload = {
  error: {
    status: number;
    message: string;
  };
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorPayload>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // TODO logging
  const statusCode = 500;
  const message = err.message || 'server error';
  res.status(statusCode);
  res.json({
    error: {
      status: statusCode,
      message,
    },
  });
};

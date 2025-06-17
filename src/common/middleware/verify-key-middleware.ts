import { Request, Response, NextFunction } from 'express';

export function verifySurveyMonkeyKey(req: Request, res: Response, next: NextFunction) {
  const expectedApiKey = process.env.SURVERYMONKEY_CLIENT_ID || '';

  const incomingApiKey = Array.isArray(req.headers['sm-apikey'])
    ? req.headers['sm-apikey'][0]
    : req.headers['sm-apikey'];

  if (!incomingApiKey || incomingApiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Unauthorized webhook request' });
  }

  next();
}

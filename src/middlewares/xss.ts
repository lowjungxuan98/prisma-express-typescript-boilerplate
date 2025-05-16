import { NextFunction, Request, Response } from 'express';
import { inHTMLData } from 'xss-filters';

/**
 * Clean for xss.
 * @param {string/object} data - The value to sanitize
 * @return {string/object} The sanitized value
 */
export const clean = <T>(data: T | string = ''): T => {
  let isObject = false;
  if (typeof data === 'object') {
    data = JSON.stringify(data);
    isObject = true;
  }

  data = inHTMLData(data as string).trim();
  if (isObject) data = JSON.parse(data);

  return data as T;
};

const middleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = clean(req.body);
    
    // Instead of modifying req.query directly, we create a sanitized version
    // and use Object.defineProperty to create a new getter
    if (req.query) {
      const sanitizedQuery = clean(req.query);
      Object.defineProperty(req, 'xssCleanedQuery', {
        value: sanitizedQuery,
        writable: false
      });
    }
    
    if (req.params) req.params = clean(req.params);
    next();
  };
};

export default middleware;

import { name, version, repository } from '../../package.json';
import config from '../config/config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: `${name} API documentation`,
    version,
    license: {
      name: 'MIT',
      url: repository
    }
  },
  externalDocs: {                // <<< this will add the link to your swagger page
    description: "swagger.json", // <<< link title
    url: "http://localhost:3000/v1/docs/swagger.json"         // <<< and the file added below in app.get(...)
  }, 
  servers: [
    {
      url: `http://localhost:${config.port}/v1`
    }
  ],
};

export default swaggerDef;

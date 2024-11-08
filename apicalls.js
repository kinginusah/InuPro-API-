import express from 'express'; //just one object from http import {createServer} from http;
import index from './API/index.js'; //. means this directory
import data from './API/data.js';
import swaggerUi from 'swagger-ui-express'; // Changed to import
import YAML from 'yamljs'; // Changed to import
import cors from 'cors';

const app = express(); //read immidieatly from library FS import { read, readFileSync } from 'fs'
app.use(express.json());



const swaggerDocument = YAML.load('./openapi/api.yaml');

app.use('/', index); // use / root index
app.use('/data', data);
const swaggerOptions = { } // specify if needed
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))
app.use('/yaml', express.static('./openapi/api.yaml')) // requires: npm install swagger-ui-express
app.use(cors());


export default app; 
import express from 'express';
import {verifyToken} from './utils.js';
import cors from "cors";
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import index from './api/index.js';
import data from './api/data.js';
import login from './api/login.js';

const swaggerDocument = YAML.load('./openapi/api.yaml')
const app = express();
app.use(express.json());

app.use(cors());

//var swaggerUi = require('swagger-ui-express');
//const YAML = require('yamljs'),
//const swaggerDocument = YAML.load('./openapi/api.yaml')

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', index);
app.use('/data', verifyToken, data);
app.use('/login', login);
//const swaggerOptions = { }
//app.use('/yaml', express.static('./openapi/api.yaml'))


export default app;
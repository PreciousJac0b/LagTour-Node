import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRouter from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth/', authRouter);

const options = {
  definition: {
    openapi: '3.0.0', 
    info: {
      title: 'LagTour documentation',
      version: '1.0.0',
      description: 'Express API for LagTour'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ],
    components: {
      securitySchemes: {
        XAuthToken: {
          type: 'apiKey',
          in: 'header',
          name: 'x-auth-token',
        }
      }
    },
    security: [
      {
        XAuthToken: []
      }
    ]
  },
  apis: ['./routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const mongo_uri:string = process.env.MONGODB_URI as string
mongoose.connect(mongo_uri)
.then(() => console.log('Successfully connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Lagtour is listening on port ${PORT}...`)
})

export default app;
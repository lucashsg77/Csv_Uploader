import express from 'express';
import cors from 'cors';
import fileRoutes from './routes/files.routes';
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileRoutes);
app.use(errorHandler);

export default app;

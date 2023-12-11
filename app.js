import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth.js'

const app = express();
dotenv.config({path:'./config/config.env'})

app.use(express.json());
app.use('/api/v1',auth);
app.listen(process.env.PORT,()=> {
    console.log(`server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});

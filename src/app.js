import express, { urlencoded } from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '10Kb'}));
app.use(urlencoded({extended: true, limit: '10Kb'}));
app.use(express.static('public'));
app.use(cookieParser()); //whenever we use req or res it will have the access of cookies


// import routes
import router from './routes/user.routes.js';

app.use("/api/v1/users", router); // passed the control to the user.routes.js file for all the routes starting with /users

export {app};







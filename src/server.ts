import passportHelper from './utils/passportHelper';
const bodyParser = require("body-parser");
import { NextFunction,Response, Request } from 'express';
const passport = require("passport");
const express = require("express");

// setup express and passport
let app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
passportHelper.init();

// run authenticate() for all routes except /api/login
app.all("/api/*", (req: Request ,res:Response, next: NextFunction) => {
    if (req.path.includes("/api/login")) return next();
    return passportHelper.authenticate((err: any, user: any, info: any) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json({ message: 'Token not valid' });
        }
        app.set("user", user);
        return next();
    })(req, res, next);
});

const routes = require("./utils/routes")(app);

const server = app.listen(3000, () => {
    console.log(`Server started on port 3000.`);
});
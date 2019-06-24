const bodyParser = require("body-parser");
const auth = require("./controllers/authController").default;
const express = require("express");
const passport = require("passport");
import Repository from './utils/repository';
import User from './models/user';
import { Strategy, ExtractJwt } from 'passport-jwt';

let app = express();
app.use(bodyParser.json());
passport.use("jwt", getPassportStrategy());

app.use(passport.initialize());

app.all("/api/*", (req: any, res: any, next: any) => {
    if (req.path.includes("/api/login")) return next();
    return auth.authenticate((err: any, user: any, info: any) => {
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

//get strategy for passport
function getPassportStrategy(): Strategy {
    const params = {
        secretOrKey: auth.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        passReqToCallback: true
    };

    return new Strategy(params, (req: any, payload: any, done: any) => {
        Repository.get(payload.userid)            
            .then((user: User) => {
                if(user === null) {
                    return done(null, false, { message: "The user in the token was not found" });
                }
                return done(null, { _id: user.id, username: user.username });
            })
            .catch((err: any) => {
                return done(err);
            });

    });
}
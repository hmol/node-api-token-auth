const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const auth = require("../controllers/authController").default;

const express = require("express");

export = () => {
    let app = express();

    app.use(bodyParser.json());
    app.use(expressValidator());

    app.use(auth.initialize());

    app.all("/api/*", (req: any, res: any, next: any) => {
        if (req.path.includes("/api/login")) return next();

        return auth.authenticate((err: any, user: any, info: any) => {
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            app.set("user", user);
            return next();
        })(req, res, next);
    });

    const routes = require("../routes")(app);

    return app;
};
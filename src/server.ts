const bodyParser = require("body-parser");
const auth = require("./controllers/authController").default;
const express = require("express");

let app = express();
app.use(bodyParser.json());
app.use(auth.initialize());

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
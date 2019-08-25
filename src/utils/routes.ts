import userController from '../controllers/userController';
import authController from '../controllers/authController';
import * as express from 'express';
import { NextFunction,Response, Request } from 'express';

export = (app: express.Application) => {
    app.post("/api/login", authController.login);

    app.post("/api/users", userController.create);
    app.delete("/api/users/:id", userController.delete);
    app.get("/api/users/:id", userController.getOne);
    app.put("/api/users/:id", userController.update);

    app.get("/api", (req: Request, res: Response) => res.status(200).json({ message: "Hello world" }));


    app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).json({ "error": "Endpoint not found" });
        next();
    });
};
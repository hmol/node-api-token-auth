import userController from '../controllers/userController';
import authController from '../controllers/authController';

export = (app: any) => {
    app.post("/api/login", authController.login);

    app.post("/api/users", userController.create);
    app.delete("/api/users/:id", userController.delete);
    app.get("/api/users/:id", userController.getOne);
    app.put("/api/users/:id", userController.update);

    app.get("/api", (req: Request, res: any) => res.status(200).json({ message: "Hello world" }));


    app.use((req: any, res: any, next: any) => {
        res.status(404).json({ "error": "Endpoint not found" });
        next();
    });
};
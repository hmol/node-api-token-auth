import UserController from '../controllers/userController';
import AuthController from '../controllers/authController';

export = (app: any) => {
    app.post("/api/login", AuthController.login);

    app.post("/api/users", UserController.create);
    app.delete("/api/users/:id", UserController.delete);
    app.get("/api/users/:id", UserController.getOne);
    app.put("/api/users/:id", UserController.update);

    app.get("/api", (req: Request, res: any) => res.status(200).json({ message: "Hello world" }));


    app.use((req: any, res: any, next: any) => {
        res.status(404).json({ "error": "Endpoint not found" });
        next();
    });
};
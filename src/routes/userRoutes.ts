import UserController from "../controllers/userController";

export = (app: any) => {
    app.post("/api/users", UserController.create);
    app.delete("/api/users/:id", UserController.delete);
    app.get("/api/users/:id", UserController.getOne);
    app.put("/api/users/:id", UserController.update);
};
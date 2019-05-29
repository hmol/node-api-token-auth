import UserController from "../controllers/userController";

export = (app: any) => {

    const endpoint = "/api/users";
    app.post(endpoint, UserController.create);
    app.delete(endpoint + "/:id", UserController.delete);
    app.get(endpoint + "/:id", UserController.getOne);
    app.get(endpoint, UserController.getAll);
    app.put(endpoint + "/:id", UserController.update);
};
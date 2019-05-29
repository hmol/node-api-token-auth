import AuthController from '../controllers/authController';

export = (app: any) => {
    app.post("/api/login", AuthController.login);
};
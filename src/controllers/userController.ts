import User from "../models/user";
import repository from "../utils/repository";
import * as bcrypt from "bcryptjs";

class UserController {

    public getAll = async (req: any, res: any) => {
        try {
            // const users = await User.find({}).exec();
            const users = await repository.getAll();
            res.status(200).json(users);
        } catch (err) {
            /* istanbul ignore next */
            res.status(400).json(err);
        }
    }

    public getOne = async (req: any, res: any) => {
        try {
            // let user = await User.findById(req.params.id).exec();
            let user = await repository.get(req.params.id);
            if (user === null) {
                return res.status(404).json({ message: "This user doesn't exist" });
            }

            res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    }

    public create = async (req: any, res: any) => {
        // try {
            this.validateRequest(req);
            let newUser = await repository.create(req.body.username, req.body.password);
            if(newUser === null) {
                res.status(500).json({'error': 'error creating user'});
            }
            res.status(201).json({'message': 'created new user. id: ' + newUser.id + ', username: ' + newUser.username});
        // } catch (err) {
        //     res.status(400).json({ "message": "Missing parameters", errors: err });
        // }
    }

    public update = async (req: any, res: any) => {
        try {
            this.validateRequest(req, true);

            await repository.update(req.params.id, req.body);
            // await User.findByIdAndUpdate(req.params.id, req.body);

            res.status(200).json({ "message": "User updated successfully!" });
        } catch (err) {
            res.status(400).json({ "message": "Missing parameters", errors: err });
        }
    }

    private validateRequest = (req: any, update = false) => {
        if (!update) {
            req.checkBody("username", "The username cannot be empty").notEmpty();
            req.checkBody("password", "The password cannot be empty").notEmpty();

            let errors = req.validationErrors();
            if (errors) throw errors;
        }

        if (Object.keys(req.body).length === 0) {
            throw "Nothing was sent";
        }
    }

    public delete = async (req: any, res: any) => {
        try {
            await repository.delete(req.params.id);
            // await User.findByIdAndRemove(req.params.id);
            res.status(200).json({ "message": "User deleted successfully!" });
        } catch (err) {
            res.status(400).json({ "message": `Error delete user: ${err}` });
        }
    }
}

export default new UserController();
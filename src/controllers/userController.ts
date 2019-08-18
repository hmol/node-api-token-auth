import repository from "../utils/repository";

class userController {

    public getOne = async (req: any, res: any) => {
        let user = await repository.get(req.params.id);
        if (user === null) {
            return res.status(404).json({ message: "This user doesn't exist" });
        }

        res.status(200).json(user);
    }

    public create = async (req: any, res: any) => {
        let newUser = await repository.create(req.body.username, req.body.password);
        res.status(201).json({'message': 'created new user. id: ' + newUser.id + ', username: ' + newUser.username});
    }

    public update = async (req: any, res: any) => {
        await repository.update(req.params.id, req.body.username, req.body.password);
        res.status(200).json({ "message": "User updated successfully!" });
    }

    public delete = async (req: any, res: any) => {
        repository.delete(req.params.id);
        res.status(200).json({ "message": "User deleted successfully!" });
    }
}

export default new userController();
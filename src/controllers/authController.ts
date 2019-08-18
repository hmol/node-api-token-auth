import * as jwt from 'jwt-simple';
import * as bcrypt from "bcryptjs";
import moment from "moment";
import user from '../models/user';
import repository from '../utils/repository';
import passportHelper from '../utils/passportHelper';

class authController {
    // random string used to genereate token
    

    // generate valid jwt token
    private getToken = (user: user): Object => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.encode({
            exp: expires,
            userid: user.id
        }, passportHelper.jwtSecret);
        
        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            userid: user.id
        };
    }

    // if username/password is match, return valid jwt token
    public login = async (req: any, res: any) => {
            let user = await repository.getByUsername(req.body.username);

            if (user === null) {
                res.status(500).json({'message': 'user could not log in'});
                return;
            }

            let isMatch = await bcrypt.compare(req.body.password, user.hashedPassword);
          
            if(isMatch) {
                res.status(200).json(this.getToken(user));
            } else {
                res.status(500).json({'message': 'user could not log in'});
            }
    }
}

export default new authController();
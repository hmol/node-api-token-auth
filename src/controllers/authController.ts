import * as jwt from 'jwt-simple';
import * as bcrypt from "bcryptjs";
const passport = require("passport");
import moment from "moment";
import User from '../models/user';
import Repository from '../utils/repository';
const jwtSecret = '^RJ3XFYv542jLL@jjG7Zxa1Ihe%9KmXiUEfOH$3iG8q*0f@J!r';

class AuthController {

    public authenticate = (callback: any) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

    private getToken = (user: User): Object => {
        let expires = moment().utc().add({ days: 7 }).unix();
        let token = jwt.encode({
            exp: expires,
            userid: user.id
        }, jwtSecret);
        
        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            userid: user.id
        };
    }

    public login = async (req: any, res: any) => {
            let user = await Repository.getByUsername(req.body.username);

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

export default new AuthController();
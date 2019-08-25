import Repository from './repository';
import user from '../models/user';
const passport = require("passport");
import { Strategy, ExtractJwt } from 'passport-jwt';


class passportHelper {
	jwtSecret = '^RJ3XFYv542jLL@jjG7Zxa1Ihe%9KmXiUEfOH$3iG8q*0f@J!r';

	init() {
		passport.use("jwt", this.getPassportStrategy());
	}

	authenticate = (callback: any) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

	// get strategy for passport
	getPassportStrategy(): Strategy {
		const params = {
			secretOrKey: this.jwtSecret,
			jwtFromRequest: ExtractJwt.fromAuthHeader(),
			passReqToCallback: true
		};

		return new Strategy(params, (req: any, payload: any, done: any) => {
			Repository.get(payload.userid)            
				.then((user: user) => {
					if(user === null) {
						return done(null, false, { message: "The user in the token was not found" });
					}
					return done(null, { _id: user.id, username: user.username });
				})
				.catch((err: any) => {
					return done(err);
				});
		});
	}
}

export default new passportHelper();
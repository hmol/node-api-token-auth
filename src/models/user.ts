import * as bcrypt from "bcryptjs";
import * as shortid from "shortid";
// const shortid = require('shortid');

export default class User {
    id: string = '';
    username: string = '';
    password: string = '';
    
    public async comparePassword(candidatePassword: string): Promise<boolean> {
        let password = this.password;
        return new Promise((resolve, reject) => {
            bcrypt.compare(candidatePassword, password, (err, success) => {
                if (err) return reject(err);
                return resolve(success);
            });
        });
    };

    constructor(username: string, password: string, id: string) {
        this.username = username;
        this.password = password;
        this.id = id;
    }

    static async create(username: string, password: string): Promise<User> {
        let hashedPassword = await this.hashPassword(password);
        return new User(username, hashedPassword, shortid.generate());
    }

    static async hashPassword(password: string): Promise<string> {
        const saltRounds = 11;
      
        const hashedPassword = await new Promise<string>((resolve, reject) => {
          bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) reject(err);
            resolve(hash);
          });
        });
      
        return hashedPassword;
      };
}
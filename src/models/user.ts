import * as bcrypt from "bcryptjs";

export default class User {
    id: string = '';
    username: string = '';
    hashedPassword: string = '';
    
    public async comparePassword(inputPassword: string): Promise<boolean> {
        let hashedPassword = this.hashedPassword;
        return new Promise((resolve, reject) => {
            bcrypt.compare(inputPassword, hashedPassword, (err, success) => {
                if (err) return reject(err);
                return resolve(success);
            });
        });
    };

    constructor(username: string, hashedPassword: string, id: string = '') {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.id = id;
    }

    static async create(username: string, password: string, id: string = ''): Promise<User> {
        let hashedPassword = await this.hashPassword(password);
        return new User(username, hashedPassword, id);
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
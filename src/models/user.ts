import * as bcrypt from "bcryptjs";

export default class user {
    id: string = '';
    username: string = '';
    hashedPassword: string = '';
    
    constructor(username: string, hashedPassword: string, id: string = '') {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.id = id;
    }
    
    // bcrypt to compare stored password hash with password from user input
    public async comparePassword(inputPassword: string): Promise<boolean> {
        let hashedPassword = this.hashedPassword;
        return new Promise((resolve, reject) => {
            bcrypt.compare(inputPassword, hashedPassword, (err, success) => {
                if (err) return reject(err);
                return resolve(success);
            });
        });
    };

    // create instance of User with correct hashed password
    static async create(username: string, password: string, id: string = ''): Promise<user> {
        let hashedPassword = await this.hashPassword(password);
        return new user(username, hashedPassword, id);
    }

    // use bcrypt to create hash of password
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
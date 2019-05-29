const {Firestore} = require('@google-cloud/firestore');
import User from '../models/user';

const firestore = new Firestore();
const collection = firestore.collection('users');

export default class Repository {
    static delete(id: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    static update(id: any, body: any): Promise<User>  {
        throw new Error("Method not implemented.");
    }

    static async create(username: string, password: string): Promise<User>  {
        return collection.where('username', '==', username).get()
        .then(async (snapshot: any) => {      
            if (snapshot.empty) {
                let newUser = await User.create(username, password);
                var data = {
                    id: newUser.id,
                    username: newUser.username,
                    password: newUser.password
                };
                  
                collection.doc(newUser.id).set(data);
                return newUser;
            }
            throw new Error("User exists.");
        });
    }

    static async get(id: string): Promise<User>  {
        //todo: use id
        return await this.getByUsername(id);
    }

    static async getByUsername(username: string): Promise<User>  {
        console.log('getByUsername ' + username);
        let query = collection.where('username', '==', username).limit(1);
        return query.get().then((snapshot: any) => {
            console.log(snapshot.docs[0].data());
            return snapshot.docs[0].data();
        });
    }

    static getAll(): Promise<User[]>  {
        throw new Error("Method not implemented.");
    }
}
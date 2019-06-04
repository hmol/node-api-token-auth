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
                if(snapshot.docs.length === 0) {
                    let newUser = await User.create(username, password);
                    var data = {
                        username: newUser.username,
                        password: newUser.password
                    } as User;
                    
                    let ref = collection.doc();
                    ref.set(data) as User;
                    newUser.id = ref.id;
                    return newUser;       
                }
                return null;
            });
    }

    static async get(id: string): Promise<User>  {
        if(!id) {
            throw new Error("Id is empty");
        }
        console.log("getbyid: " + id);
        let query = collection.doc(id);
        return query.get().then((ref: any) => {
            if (!ref.exists) {
                throw new Error("No use found with id: " + id);
            }
            let data = ref.data();
            let user = new User(data.username, data.password, ref.id);
            console.log(user);
            return user;
        });
    }

    static async getByUsername(username: string): Promise<User>  {
        let query = collection.where('username', '==', username).limit(1);
        return await query.get().then((snapshot: any) => {
            if(snapshot.docs.length === 0) {
                return null;
            }
            console.log('getByUsername');
            console.log(snapshot.docs[0].data());
            let ref = snapshot.docs[0];
            let data = ref.data();
            let user = new User(data.username, data.password, ref.id);
            return user;
        });
    }

    static getAll(): Promise<User[]>  {
        throw new Error("Method not implemented.");
    }
}
const {Firestore} = require('@google-cloud/firestore');
import User from '../models/user';

const firestore = new Firestore();
const collection = firestore.collection('users');

export default class Repository {

    static delete(id: any): void {
        collection.doc(id).delete();
    }

    static async update(id: string, username: string, password: string): Promise<User>  {
        var docRef = collection.doc(id);
        var updateObject = await User.create(username, password);
        var data = { 'username': updateObject.username, 'password': updateObject.hashedPassword };
        docRef.update(data);
        return await this.get(id);
    }

    static async create(username: string, password: string): Promise<User>  {
        return collection.where('username', '==', username).get()
            .then(async (snapshot: any) => {      
                if(snapshot.docs.length === 0) {
                    let newUser = await User.create(username, password);
                    var data = {
                        username: newUser.username,
                        password: newUser.hashedPassword
                    };
                    
                    let ref = collection.doc();
                    return ref.set(data).then(async () => await this.get(ref.id));
                }
                return null;
            });
    }

    static async get(id: string): Promise<User>  {
        if(!id) {
            throw new Error("Id is empty");
        }
        let query = collection.doc(id);
        return query.get().then((ref: any) => {
            if (!ref.exists) {
                throw new Error("No use found with id: " + id);
            }
            let data = ref.data();
            return this.toUserObject(data, ref.id);
        });
    }

    static async getByUsername(username: string): Promise<User>  {
        let query = collection.where('username', '==', username).limit(1);
        return await query.get().then((snapshot: any) => {
            if(snapshot.docs.length === 0) {
                return null;
            }
            let ref = snapshot.docs[0];
            let data = ref.data();
            return this.toUserObject(data, ref.id);
        });
    }

    static toUserObject(data: any, id: string) {
        return new User(data.username, data.password, id);
    }
}
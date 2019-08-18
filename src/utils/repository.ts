const {Firestore} = require('@google-cloud/firestore');
import user from '../models/user';

const firestore = new Firestore();
const collection = firestore.collection('users');

class repository {

    delete(id: any): void {
        collection.doc(id).delete();
    }

    async update(id: string, username: string, password: string): Promise<user>  {
        var docRef = collection.dc(id);
        var updateObject = await user.create(username, password);
        var data = { 'username': updateObject.username, 'password': updateObject.hashedPassword };
        docRef.update(data);
        return await this.get(id);
    }

    async create(username: string, password: string): Promise<user>  {
        return collection.where('username', '==', username).get()
            .then(async (snapshot: any) => {      
                if(snapshot.docs.length === 0) {
                    let newUser = await user.create(username, password);
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

    async get(id: string): Promise<user>  {
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

    async getByUsername(username: string): Promise<user>  {
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

    toUserObject(data: any, id: string) {
        return new user(data.username, data.password, id);
    }
}

export default new repository();
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection = this.db.collection<IUser>('users');

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) { }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error('Password is required !')
    }
    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    );
    await this.usersCollection.add({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });
  }
}

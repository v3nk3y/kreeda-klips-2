import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection = this.db.collection<IUser>('users');
  public isAuthenticated$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) { 
    auth.user.subscribe(val => console.log(val));
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
  }

  public async createUser(userData: IUser) {
    if(!userData.password) {
      throw new Error('Password is required !')
    }

    const userCredentials = await this.auth.createUserWithEmailAndPassword(
      userData.email as string, userData.password as string
    );

    if(!userCredentials.user) {
      throw new Error('User not found !')
    }

    await this.usersCollection.doc(userCredentials.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    userCredentials.user.updateProfile({ displayName: userData.name});
  }
}

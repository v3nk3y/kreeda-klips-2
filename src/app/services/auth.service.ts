import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import { delay, filter, map, switchMap } from 'rxjs/operators'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection = this.db.collection<IUser>('users');
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router, private route: ActivatedRoute,) { 
    auth.user.subscribe(val => console.log(val));
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({authOnly: false}) )
    ).subscribe(console.log)
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

  async logOut($event?: Event) {
    if($event){
      $event.preventDefault();
    }
    await this.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}

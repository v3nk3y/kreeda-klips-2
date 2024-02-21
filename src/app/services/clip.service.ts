import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {
    this.clipsCollection = this.db.collection('clips');
   }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return  this.clipsCollection.add(data);
  }

  getUserClips() {
    return this.auth.user.pipe(
      switchMap(user => {
        // If user is null then return an empty array obj as SMap expects an Observable object to subscribe
        if(!user){
          return of([]);
        }

        // To generate a query form the the collection to grap user's clips based on the uid of user
        const query = this.clipsCollection.ref.where('uid', "==", user.uid);

        // Run the query and retunr the object
        return query.get();
      }),
      // to go over the snapshot collection returned from switchmap to map each document seperately
      // returns an array of snapshots
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs),
    );
  }

  updateClip(id: string, title: string) {
    return  this.clipsCollection.doc(id).update({
      title
    });
  }
}

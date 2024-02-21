import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection!: AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private storage: AngularFireStorage) {
    this.clipsCollection = this.db.collection('clips');
   }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return  this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    // Using combineLatest as we need 2 values both user and sort
    return combineLatest([
      this.auth.user,
      sort$
    ]).pipe(
      switchMap(values => {
        // Desctructuring for user and sort
        const [user, sort] = values;

        // If user is null then return an empty array obj as SMap expects an Observable object to subscribe
        if(!user){
          return of([]);
        }

        // To generate a query form the the collection to grap user's clips based on the uid of user
        const query = this.clipsCollection.ref.where(
          'uid', "==", user.uid
          ).orderBy(
            // Using orderby to sort in desc or asc based on timestamp
            'timestamp', sort === '1' ? 'desc' : 'asc'
            );

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

  async deleteClip(clip: IClip) {
    // We need to grab reference for deleting the clip reference from the storage
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    await clipRef.delete();
    
    // We need to delete the clip document from the collection of documents that contain clipdata
    await this.clipsCollection.doc(clip.docID).delete();
  }
}

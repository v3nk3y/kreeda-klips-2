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
  pageClips: IClip[] = [];
  pendingRequest = false;

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
    // We need to grab reference for deleting the clip reference & screenshot reference from the storage
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`);


    // Delete the clip followed by screenshot
    await clipRef.delete();
    await screenshotRef.delete();
    
    // We need to delete the clip document from the collection of documents that contain clipdata
    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {
    if(this.pendingRequest) {
      // If request is alreading peding then return to avoid other subsequest requests
      return;
    }

    this.pendingRequest = true;

    // Initially - Get the latest 6 videos from the db
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)

    const { length } = this.pageClips;
    // Based on the pageClips length 
    if(length) {
      // Grab the lastDocId form the list of pageclips
      const lastDocID = this.pageClips[length - 1]?.docID;
      // Grab the last document from the collection using the docID
      const lastDoc = await this.clipsCollection.doc(lastDocID)
        .get().toPromise();
      
      // Update the query to start after the last itme in list, so that we can get the next items from the collection
      query = query.startAfter(lastDoc);
    }

    // Get the next set of clips snapshots nad push them to the pageClips
    const snapshot = await query.get();
    snapshot.forEach(doc => {
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(), 
      }
      )
    })
    this.pendingRequest = false;

    console.log(this.pageClips);

    return this.pageClips;
  }
}

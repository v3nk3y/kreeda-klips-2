import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import firebase from 'firebase/compat/app'
import { Observable, map } from 'rxjs';
import { ClipService } from '../services/clip.service';
import { inject } from '@angular/core';

export default interface IClip {
  docID?: string;
  uid: string;
  displayName: string;
  title: string;
  fileName: string;
  url: string;
  // Used the type returned by timestamp form firestore
  timestamp: firebase.firestore.FieldValue;
  screenshotURL: string;
  screenshotFileName: string;
}

// Reolver Function for - Clip component 
export const clipResolver: ResolveFn<IClip | null> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) : Observable<IClip | null> => {
  
  // Injecting services as needed
  const clipsService = inject(ClipService);
  const router = inject(Router);
  
  return clipsService.clipsCollection.doc(route.params.id)
    .get()
    .pipe(
      map((snapshot: firebase.firestore.DocumentSnapshot<IClip>) => {
        const data = snapshot.data();

        if(!data) {
          router.navigate(['/']);
          return null;
        }

        return data;
      })
    )
}
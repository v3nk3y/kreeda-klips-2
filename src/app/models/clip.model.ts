import firebase from 'firebase/compat/app'

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
    // screenshotFileName: string;
  }

import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app'
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fireTimestamp'
})
export class FireTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue) {
    //  We need to assert the type of firebase value as ToDate() cantrecognise the type otherwise
    const date = (value as firebase.firestore.Timestamp).toDate();
    return this.datePipe.transform(date, 'mediumDate');
  }

}

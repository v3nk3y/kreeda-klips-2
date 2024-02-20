import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  }
  emailPattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}';
  showAlert = false;
  alertMsg = 'Please wait! We are logging you in.';
  alertColor = 'blue';
  inSubmission = false;

  constructor(private auth: AngularFireAuth) {}

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue';
    this.inSubmission = true;
    
    try {
      await this.auth.signInWithEmailAndPassword(this.credentials.email, this.credentials.password);
    } catch (error) {
      this.alertMsg = 'An unexpected error occur. Please try again later!'
      this.alertColor = 'red';
      this.inSubmission = false;
      this.showAlert = true;
      console.log(error);
      return;
    }
    
    this.alertMsg = 'Success! You are logged in.'
    this.alertColor = 'green';
    this.inSubmission = false;
    this.showAlert = true;
  }
}

import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email
    ]),
    age: new FormControl('', [
      Validators.required, 
      Validators.min(18)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
    ]),
    confirm_password: new FormControl('',[
      Validators.required
    ]),
    phone_number: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(13)
    ]),
  });
  showAlert = false;
  alertMsg = 'Please wait! Your account is being created.';
  alertColor = 'blue';
  inSubmission = true;


  constructor(private auth: AngularFireAuth) {}

  async register() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! Your account is being created.';
    this.alertColor = 'blue';
    const { email, password } = this.registerForm.value;

    try {
      const userCredentials = await this.auth.createUserWithEmailAndPassword(
        email as string, password as string
      );
      console.log('UserCredentials: ', userCredentials)
    } catch (error) {
      console.log('Error: ', error);
      this.alertMsg = 'An unexpected error occur. Please try again later'
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }

    this.alertMsg = 'Success! Your account has been created.'
    this.alertColor = 'green';
  }
}

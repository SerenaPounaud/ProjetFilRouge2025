import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
signUpForm !:FormGroup; //groupe les inputs
users:any[]=[];

constructor(private formBuilder:FormBuilder){}

ngOnInit():void{ //s'exécute une seule fois, ne retourne aucune données
  this.signUpForm = this.formBuilder.group({
    lastname : ['', [Validators.required, Validators.maxLength(50)]],
    firstname : ['', [Validators.required, Validators.maxLength(50)]],
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
    confirmPassword : ['', [Validators.required]],
    cgu : [false, Validators.requiredTrue]
  })
}
signUp(){
  console.log(this.signUpForm.value);
  if (this.signUpForm.valid) {
    this.users = JSON.parse(localStorage.getItem("users") || "[]");
    this.users.push(this.signUpForm.value);
    localStorage.setItem("users", JSON.stringify(this.users));
    alert("Création du compte avec succés");
    this.signUpForm.reset();
  }
}
}

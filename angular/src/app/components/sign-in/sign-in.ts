import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
signInForm !: FormGroup;
users:any[]=[];

constructor(private formBuilder:FormBuilder, private router:Router){}

ngOnInit():void{
  //récupère les users
  this.users = JSON.parse(localStorage.getItem("users") || "[]")

  this.signInForm = this.formBuilder.group({
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
  })
}

signIn(){
  let formValue = this.signInForm.value;
  const user = this.users.find((user:any) => user.email === formValue.email && user.password === formValue.password)
  console.log(user);
  if(!user){
    alert("Email ou mot de passe incorrect");
    return;
  }

  //stock user connecté
  localStorage.setItem('connectedUser', JSON.stringify(user));

  //redirection vers profil
  this.router.navigate(['profil']);
}
}

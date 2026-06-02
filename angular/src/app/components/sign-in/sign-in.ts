import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
signInForm !: FormGroup;
userService = inject(UsersService);

constructor(private formBuilder:FormBuilder, private router:Router){}

ngOnInit():void{
  this.signInForm = this.formBuilder.group({
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
  })
}

signIn(){
  let formValue = this.signInForm.value;
  this.userService.signin(formValue).subscribe({
    next: (res:any) => {
      console.log(res);
      localStorage.setItem('token', res.token);
      this.router.navigate(['profil']);
    },
    error: (err) => {
      alert("Email ou mot de passe incorrect");
    }
  });
  }
}

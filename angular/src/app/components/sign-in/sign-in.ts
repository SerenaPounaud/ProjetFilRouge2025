import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
signInForm !: FormGroup;

constructor(
  private formBuilder:FormBuilder, 
  private router:Router, 
  private authService: AuthService, 
  private userService: UsersService){}

ngOnInit():void{
  this.signInForm = this.formBuilder.group({
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
  })
}

  signIn() {
  const formValue = this.signInForm.value;
  this.userService.signin(formValue).subscribe({
    next: (res) => {
      this.authService.setConnected(true);
      this.authService.setExpiration(res.expiresAt);
      this.router.navigate(['profil']);
    },
    error: () => {
      alert("Email ou mot de passe incorrect");
    }
  });
    
  }
}

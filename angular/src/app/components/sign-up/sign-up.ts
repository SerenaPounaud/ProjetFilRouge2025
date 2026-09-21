import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
signUpForm !:FormGroup; //groupe les inputs

constructor(
  private formBuilder: FormBuilder, 
  private router: Router, 
  private userService : UsersService, 
  private authService: AuthService){}

ngOnInit():void{ //s'exécute une seule fois, ne retourne aucune données
  this.signUpForm = this.formBuilder.group({
    lastname : ['', [Validators.required, Validators.maxLength(50)]],
    firstname : ['', [Validators.required, Validators.maxLength(50)]],
    email : ['', [Validators.required, Validators.email]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
    cgu : [false, Validators.requiredTrue]
  });
}
  signUp() {
   this.userService.signup(this.signUpForm.value).subscribe({
    next : (res) => {
      this.authService.setConnected(true);
      this.authService.setExpiration(res.expiresAt);
      alert('Inscription réussie');
      this.router.navigate(['']);
    },
    error: (err) => {
      console.log(err);
      const message = err.error?.errors?.join(', ') // transforme en string + virgule
      || err.error?.message || "Erreur lors de la création du compte";
      alert(message);
    }
   });
  }
}

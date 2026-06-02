import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
signUpForm !:FormGroup; //groupe les inputs
router= inject(Router);
userService = inject(UsersService);

constructor(private formBuilder:FormBuilder){}

ngOnInit():void{ //s'exécute une seule fois, ne retourne aucune données
  this.signUpForm = this.formBuilder.group({
    lastname : ['', [Validators.required, Validators.maxLength(50)]],
    firstname : ['', [Validators.required, Validators.maxLength(50)]],
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
    confirmPassword : ['', [Validators.required]],
    cgu : [false, Validators.requiredTrue]
  });
}
  signUp(): void {
    if (this.signUpForm.invalid) return;

    this.userService.signup(this.signUpForm.value).subscribe({
      next: () => {
        alert("Compte créé avec succès");
        this.router.navigate(["/sign-in"]);
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la création du compte");
      }
    });
  }
}


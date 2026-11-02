import { Component } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

interface UserProfile {
  _id: string;
  lastname: string;
  firstname: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-profil-infos',
  imports: [ReactiveFormsModule],
  templateUrl: './profil-infos.html',
  styleUrl: './profil-infos.css',
})
export class ProfilInfos {
profilFrom!: FormGroup;
user: UserProfile | null = null; //contient l'objet de l'interface ou valeur null

message = '';
errorMessage = '';
isSaving = false;

constructor(private fb: FormBuilder, private usersService: UsersService) {}

ngOnInit(): void {
  this.profilFrom = this.fb.group({
    lastname: ['', [Validators.maxLength(50)]],
    firstname: ['', [Validators.maxLength(50)]],
    email: ['', [Validators.maxLength(150), Validators.email]],
    newPassword: ['', [Validators.maxLength(20), Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    currentPassword: ['']
  });
  this.loadProfil();
}

//récupère les infos de l'utilisateur
loadProfil(): void {
  this.usersService.me().subscribe({
    next: (res:any) => {
      //utilisateur authentifié + infos récupérées
      if (res.authenticated && res.user) {
        this.user = res.user;
      }
    },
    error: (err) => {
      console.error('Erreur lors du chargement du profil :', err);
    }
  })
}

formValid(): boolean {
  //vérifie si les champs respectent les validateurs, si au moins un champ à été modifié et aucune sauvegarde en cours
  return this.profilFrom.valid && this.profilFrom.dirty && !this.isSaving;
}

updateProfil(): void {
  if (this.profilFrom.invalid || this.isSaving) {
    this.profilFrom.markAllAsTouched(); //marque tous les champs comme touchés pour afficher les messages d'erreur
    return;
  }
  const values = this.profilFrom.getRawValue(); //récupères les valeurs du form, même celles désactivées
  const updateFields: Record<string, string> = {}; //stocke uniquement les infos à modifier

  //parcours les champs pour ne garder que ceux qui ont été modifiés et non vides
  for (const field of ['lastname', 'firstname', 'email'] as const) { //as const = chaînes précises/strictes
    const value = values[field];
    if (typeof value === 'string' && value.trim() !== '') { //valeur non vide ou composée uniquement d'espaces
      updateFields[field] = value.trim();
    }
  }
  if (values.currentPassword) {
    updateFields['currentPassword'] = values.currentPassword;
  }
  if (values.newPassword) {
    updateFields['newPassword'] = values.newPassword;
  }
  //Object.keys() = récupère toutes les clés d'un objet sous forme de tableau
  if (Object.keys(updateFields).length === 0) {
    this.errorMessage = 'Renseigne au moins un champ à modifier';
    return;
  }
  if (values.newPassword && !values.currentPassword) {
    this.errorMessage = 'Le mot de passe actuel est obligatoire';
    return;
  }
  if (values.currentPassword && !values.newPassword) {
    this.errorMessage = 'Le nouveau mot de passe est obligatoire';
    return;
  }
  this.isSaving = true;
  this.message = '';
  this.errorMessage = '';

  this.usersService.updateProfil(updateFields).subscribe({
    next: (res: any) => {
      this.user = res.user; //met à jour les infos
      this.profilFrom.reset();
      this.message = 'Profil modifié avec succès';
      this.isSaving = false;
    },
      error: (err) => {
        if (err.error?.errors?.length) { //vérifie si le backend renvoie un tab d'erreurs
          //transforme le tab en une seule chaîne en les séparant par des espaces
            this.errorMessage = err.error.errors.join(' '); 
        } else { //récupère le message classique du backend
            this.errorMessage = err.error?.message || 'Erreur lors de la modification du profil';
        }
        this.isSaving = false;
      }
});
}
}

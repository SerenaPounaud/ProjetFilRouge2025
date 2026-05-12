import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil-recettes',
  imports: [ReactiveFormsModule],
  templateUrl: './profil-recettes.html',
  styleUrls: ['./profil-recettes.css']
})
export class ProfilRecettes implements OnInit {
  addRecipeForm!: FormGroup;
  selectedFile?: File; //img selectionnée, file ou undifined(optionnel)
  previewImg: string | ArrayBuffer | null = null; //aperçu img,(arraybuffer = binaire brut/pdf/audio)
  ingredientsList: string[] = [];
  motsClesList: string[] = [];
  recettesUsers: any[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef; //récupère l'élément du template

  constructor(private fb: FormBuilder) {}

ngOnInit(): void {

  this.addRecipeForm = this.fb.group({
    nomRecette: ['', [Validators.required, Validators.maxLength(30)]],
    heures: ['', Validators.required],
    minutes: ['', Validators.required],
    nbPersonnes: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    ingredients: ['', [Validators.maxLength(20)]],
    instructions: ['', [Validators.required, Validators.maxLength(60000)]],
    motsCles: ['', [Validators.maxLength(20), Validators.minLength(3)]],
  });

//récupère les recettes stockées dans le localstorage
  const saved = localStorage.getItem('recettes');
  this.recettesUsers = saved ? JSON.parse(saved) : []; //convertit en tab
};

// gestion img
selectImg(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]; //récupère le fichier sélectionné
  if (!file) return;

  this.selectedFile = file; //stock l'img dedans

  //lecteur de fichier
  const reader = new FileReader(); //transforme un fichier en texte/affichable
  reader.onload = () => { //quand lecture terminé
    this.previewImg = reader.result; //contient le nouveau fichier (en base64)
  };
  reader.readAsDataURL(file); //affiche l'img (lis & transforme en dataurl)
};

// gestion liste ingrédients
addIngredient(): void {
  const value = this.addRecipeForm.value.ingredients?.trim(); //s'exécute seulement si ingredients existe et n’est pas null/undefined

  if (value && !this.ingredientsList.includes(value)) { //vérifie si pas vide + doublons
    this.ingredientsList.push(value);
    this.addRecipeForm.patchValue({ ingredients: '' }); //vide le champ
  }
};
removeIngredient(i: number): void {
  this.ingredientsList.splice(i, 1);
};

// gestion liste mots clés
addMotCle(): void {
  const value = this.addRecipeForm.value.motsCles?.trim();

  if (value && !this.motsClesList.includes(value)) {
    this.motsClesList.push(value);
    this.addRecipeForm.patchValue({ motsCles: '' });
  }
};
removeMotCle(i: number): void {
  this.motsClesList.splice(i, 1);
};

removeRecetteUser(i: number): void {
  this.recettesUsers.splice(i, 1);
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));
};

// validation form
formValid(): boolean {
  return this.addRecipeForm.valid && this.ingredientsList.length > 0 && this.motsClesList.length > 0 && !!this.previewImg; //convertit en boolean
};

// ajout recette
addRecipe(): void {
  if (!this.formValid()) return;

  const form = this.addRecipeForm.value;

  const newRecipe = {
    id: Date.now(),
    nomRecette: form.nomRecette,
    img: this.previewImg,
    temps: `${form.heures}h${form.minutes}`,
    nbPersonnes: form.nbPersonnes,
    ingredients: this.ingredientsList,
    instructions: form.instructions,
    motsCles: this.motsClesList
  };

  this.recettesUsers.push(newRecipe); //ajoute la recette dans le tab
  localStorage.setItem('recettesUsers', JSON.stringify(this.recettesUsers));

  this.resetForm();
};

// reset formulaire
resetForm(): void {
  this.addRecipeForm.reset({ //remet aux valeurs par défaut
    heures: '0',
    minutes: '0',
    nbPersonnes: 1
  });
  //vide les listes + img
  this.ingredientsList = [];
  this.motsClesList = [];
  this.previewImg = null;
  this.selectedFile = undefined;
  if (this.fileInput) {
    this.fileInput.nativeElement.value='';
  }
};
}
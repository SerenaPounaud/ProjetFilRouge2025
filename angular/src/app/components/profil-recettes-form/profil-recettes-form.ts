import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil-recettes-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profil-recettes-form.html',
  styleUrl: './profil-recettes-form.css',
})

export class ProfilRecettesForm {
  addRecipeForm!: FormGroup;
  selectedFile?: File; //img selectionnée, file ou undifined(optionnel)
  previewImg: string | ArrayBuffer | null = null; //aperçu img,(arraybuffer = binaire brut/pdf/audio)
  ingredientsList: string[] = [];
  motsClesList: string[] = [];

  @Input() recette: any; //permet d'envoyer une recette
  @Input() editIndex: number | null = null; //reçoit l'index de la recette à modifier
  @ViewChild('fileInput') fileInput!: ElementRef; //récupère l'élément du template
  @Output() recipeCreated = new EventEmitter<any>(); //envoi un event au parent

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
}
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

// validation form
formValid(): boolean {
  return this.addRecipeForm.valid && this.ingredientsList.length > 0 && this.motsClesList.length > 0 && !!this.previewImg; //convertit en boolean
};

// reset formulaire
resetForm(): void {
  this.addRecipeForm.reset({ //remet aux valeurs par défaut
    heures: null,
    minutes: null,
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

// ajout recette
addRecipe(): void {
  if (!this.formValid()) return;

  const form = this.addRecipeForm.value;

  const newRecipe = {
    id: this.recette?.id || Date.now(), //garde l'id pendant l'edit sinon en créer un
    nomRecette: form.nomRecette,
    img: this.previewImg,
    temps: `${form.heures}h${form.minutes}`,
    nbPersonnes: form.nbPersonnes,
    ingredients: this.ingredientsList,
    instructions: form.instructions,
    motsCles: this.motsClesList
  };

  this.recipeCreated.emit({recipe: newRecipe, index: this.editIndex}); //envoi une nouvelle recette + id au parent
  
  if (this.editIndex !== null) {
    alert('Recette modifiée avec succès !');
  } else {
    alert('Recette ajoutée avec succès !');
  }
  this.resetForm();
  this.recette = null; //retire la recette en édition
};

ngOnChanges(changes: SimpleChanges): void { //détecte les changements des @Input

  if (changes['recette'] && this.recette && this.addRecipeForm) { //vérifie si recette a changé

    const temps = this.recette.temps.split('h'); //découpe le temps ex: ["2", "30"]

    this.addRecipeForm.patchValue({ //modifie certains champs
      nomRecette: this.recette.nomRecette,
      heures: temps[0], //index du tab
      minutes: temps[1],
      nbPersonnes: this.recette.nbPersonnes,
      instructions: this.recette.instructions
    });

    this.ingredientsList = [...this.recette.ingredients]; //copie le tab original
    this.motsClesList = [...this.recette.motsCles];

    this.previewImg = this.recette.img; //réaffiche l’img actuelle dans le formulaire lorsqu’on édite
  }
}

}

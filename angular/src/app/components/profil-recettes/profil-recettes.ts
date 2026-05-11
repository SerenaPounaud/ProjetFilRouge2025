import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil-recettes',
  imports: [ReactiveFormsModule],
  templateUrl: './profil-recettes.html',
  styleUrl: './profil-recettes.css',
})
export class ProfilRecettes {
addRecipeForm !:FormGroup;
users:any[]=[];
selectedFile !: File;

recettesUsers: any = [
  {id:1, nomRecette: 'Recette 1', img: 'assets/img/cake.webp'},
  {id:2, nomRecette: 'Recette 2', img: 'assets/img/cake.webp'},
  {id:3, nomRecette: 'Recette 3', img: 'assets/img/cake.webp'},
  {id:4, nomRecette: 'Recette 4', img: 'assets/img/cake.webp'}
];


constructor(private formBuilder:FormBuilder){}

ngOnInit():void{
  this.addRecipeForm = this.formBuilder.group({
    nomRecette : ['', [Validators.required, Validators.maxLength(30)]],
    img : ['',[Validators.required]],
    heures : ['0',[Validators.required]],
    minutes : ['0',[Validators.required]],
    nbPersonnes : ['1', [Validators.required, Validators.max(10), Validators.min(1)]],
    ingredients : ['', [Validators.required, Validators.maxLength(20)]],
    instructions : ['', [Validators.required, Validators.maxLength(60000)]],
    motsCles : ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
  })
}
addRecipe(){
  console.log(this.addRecipeForm.value);
  if (this.addRecipeForm.valid) {
    const formValue = this.addRecipeForm.value;
    let listeIngredients = [];
    let listeMotsCles = [];

    if (formValue.ingredients) listeIngredients.push('ingredients');
    if (formValue.motsCles) listeMotsCles.push('motsCles');

    //objet final
    const finalRecipe = {
    nomRecette : formValue.nomRecette,
    img : formValue.img,
    heures : formValue.heures,
    minutes : formValue.minutes ,
    nbPersonnes : formValue.nbPersonnes,
    listeIngredients,
    instructions : formValue.instructions,
    listeMotsCles,
    };

    this.users = JSON.parse(localStorage.getItem("users") || "[]");
    this.users.push(finalRecipe);
    localStorage.setItem("users", JSON.stringify(this.users));
    alert("Création du compte avec succés");
    this.addRecipeForm.reset();
  }
}
}

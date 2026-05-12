import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
contactForm !: FormGroup;
usersContact:any[]=[];

constructor(private formBuilder:FormBuilder){}

ngOnInit():void{ //s'exécute une seule fois, ne retourne aucune données
  this.contactForm = this.formBuilder.group({
    lastname : ['', [Validators.required, Validators.maxLength(50)]],
    firstname : ['', [Validators.required, Validators.maxLength(50)]],
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    message : ['', [Validators.required, Validators.maxLength(255)]],
    rgpd : [false, Validators.requiredTrue]
  })
};
contact(){
  console.log(this.contactForm.value);
  if (this.contactForm.valid) {
    this.usersContact = JSON.parse(localStorage.getItem("usersContact") || "[]");
    this.usersContact.push(this.contactForm.value);
    localStorage.setItem("usersContact", JSON.stringify(this.usersContact));
    alert("Envoi du message avec succés");
    this.contactForm.reset();
  }
}
}

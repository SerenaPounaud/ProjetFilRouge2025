import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
contactForm !: FormGroup;
@Output() formSubmitted = new EventEmitter<any>();

constructor(private formBuilder:FormBuilder){}

ngOnInit():void{ //s'exécute une seule fois, ne retourne aucune données
  this.contactForm = this.formBuilder.group({
    lastname : ['', [Validators.required, Validators.maxLength(50)]],
    firstname : ['', [Validators.required, Validators.maxLength(50)]],
    email : ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    message : ['', [Validators.required, Validators.maxLength(1000)]],
    rgpd : [false, Validators.requiredTrue]
  })
};
contact(){
  if (this.contactForm.valid) {
    this.formSubmitted.emit(this.contactForm.value);
    this.contactForm.reset();
  }
}
}

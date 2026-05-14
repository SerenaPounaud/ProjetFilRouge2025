import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
usersContact:any[]=[];

saveContact(message: any) {
    this.usersContact = JSON.parse(localStorage.getItem("usersContact") || "[]");
    this.usersContact.push(message);
    localStorage.setItem("usersContact", JSON.stringify(this.usersContact));
    alert("Envoi du message avec succés");
}
}

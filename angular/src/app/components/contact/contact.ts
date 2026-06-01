import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactForm } from '../contact-form/contact-form';
import { ContactService } from '../../services/contact-service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
    
  constructor(private contactService: ContactService) {}

saveContact(message: any) {
  this.contactService.sendMessage(message).subscribe({
    next: (res) => {
      alert("Message envoyé avec succès");
    },
    error: (err) => {
      console.error(err);
      alert("Erreur lors de l'envoi");
    }
  });
}

}

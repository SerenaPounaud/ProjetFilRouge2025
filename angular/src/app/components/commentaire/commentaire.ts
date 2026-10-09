import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommentaireService } from '../../services/commentaire-service';

@Component({
  selector: 'app-commentaire',
  imports: [DatePipe],
  templateUrl: './commentaire.html',
  styleUrl: './commentaire.css',
})
export class Commentaire {
//transmittion parent/enfant
@Input() commentaire!: any;
@Input() currentUser: any = null;
@Input() isConnected = false;

@Output() commentaireSupprime = new EventEmitter<string>();

constructor(private commentaireService: CommentaireService) {}

removeCommentaire(id: string): void {
  if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
    return;
  }

  this.commentaireService.deleteCommentaireById(id).subscribe({
    next: () => {this.commentaireSupprime.emit(id);},
    error: (error) => {
      console.error('Erreur lors de la suppression du commentaire', error);
    }
  });
}
}

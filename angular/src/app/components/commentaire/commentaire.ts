import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { CommentaireService } from '../../services/commentaire-service';

@Component({
  selector: 'app-commentaire',
  imports: [DatePipe],
  templateUrl: './commentaire.html',
  styleUrl: './commentaire.css',
})
export class Commentaire {
@Input() commentaire!: any;
isConnected = false;
@Output() commentaireSupprime = new EventEmitter<string>();
currentUser: any = null;

constructor(private authService: AuthService, private commentaireService: CommentaireService) {}

ngOnInit() {
  this.authService.isConnected$.subscribe(status => {
    this.isConnected = status;
  });
  this.authService.checkAuth().subscribe({ 
    next: (user) => { 
      this.currentUser = user; 
      this.isConnected = true; 
      console.log('Commentaire user:', this.commentaire.user);
console.log('Current user:', this.currentUser);
    }, 
      error: () => { 
        this.currentUser = null; 
        this.isConnected = false; 
      } 
    });
}

removeCommentaire(id: string): void {
  if (!confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
    return;
  }

  this.commentaireService.deleteCommentaireById(id).subscribe({
    next: () => {
      this.commentaireSupprime.emit(id);
    },
    error: (error) => {
      console.error('Erreur lors de la suppression du commentaire', error);
    }
  });
}
}

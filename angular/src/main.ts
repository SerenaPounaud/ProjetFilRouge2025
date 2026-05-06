import { bootstrapApplication } from '@angular/platform-browser'; //sert à démarrer l'appli angular
import { appConfig } from './app/app.config';  //config global
import { App } from './app/app'; //composant principal

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
//démarre l'application
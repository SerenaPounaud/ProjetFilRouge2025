import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if(!token){
    return next(req);
  }
    const authReq = req.clone({ //copie req + ajout header http
      setHeaders: {
        Authorization: `Bearer ${token}` //Bearer = format pour envoyer un token
      }
  });
  return next(authReq); //envoie la req modifiée avec token
};

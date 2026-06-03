import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if(!token){
    return next(req);
  }
    const authReq = req.clone({ //sert à transporter une preuve d’identité vers le serveur pour autorisation
      setHeaders: {
        Authorization: `Bearer ${token}` //Bearer = format pour envoyer un token
      }
  });
  return next(authReq);
};

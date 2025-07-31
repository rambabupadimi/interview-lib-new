

import { HttpInterceptorFn } from '@angular/common/http';



export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const clonedRequest = req.clone({
    setHeaders: {

      Authorization: `Bearer ${localStorage.getItem('admin_accessToken')}`,

    },

  });

  return next(clonedRequest);

};
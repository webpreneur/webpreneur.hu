import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone request to include credentials for cookie-based authentication
  const authReq = req.clone({
    withCredentials: true
  });
  
  return next(authReq);
};

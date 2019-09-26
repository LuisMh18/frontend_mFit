import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { GLOBAL } from '../global';

import { Observable, pipe } from 'rxjs';

import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string;
  identity;
  token;
  constructor(private _http: Http) {
    this.url = GLOBAL.url;
  }


  //login
  signup(user_login): Observable<any> {
    console.log("llamamos al servicio de inicio de sesión");
    let params = JSON.stringify(user_login);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.url + 'login', params, options)
    .pipe( map(res => res.json()) );


  }


  //cerrar sesion
logout(token) {
  return this._http.get(this.url + 'logout?token=' + token)
    .pipe( map(res => res.json()) );
}


//obtener datos del usuario
getIdentity() {
  /* Y ahora, al recuperarlo, convertimos el string nuevamente en un objeto con JSON.parse */
  let identity = JSON.parse(localStorage.getItem('identity'));
  //console.log("identity: " + identity);

  if (identity != "undefined") {
    this.identity = identity;
    //console.log("accdemos al email: " + identity.email);
  } else {
    this.identity = null;
  }

  return this.identity;
}

//obtener toen
getToken() {
  let token = localStorage.getItem('token');
  //console.log("identity:--"+ localStorage.identity);

  if (token != "undefined") {
    this.token = token;
  } else {
    this.token = null;
  }

  return this.token;
}




}

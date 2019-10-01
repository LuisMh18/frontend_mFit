import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { GLOBAL } from '../../global';

import { Observable, pipe } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  public url: string;

  constructor(
    private _http: Http,
  ) {
    this.url = GLOBAL.url;
  }


  getData(token, page = null, dataform) {
    let params = JSON.stringify(dataform);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let ruta_page = (page == null) ? 'rol/index?token=' + token : 'rol/index?token=' + token + '&page=' + page;
    return this._http.post(this.url + ruta_page, params, options)
      .pipe( map(res => res.json()) );

  }

  getAll(token) {
    return this._http.get(this.url+'rol/data?token='+token)
                     .pipe( map(res => res.json()) );
  }

  delete(token, id){
    return this._http.delete(this.url+'rol/'+id+'?token='+token)
                       .pipe( map(res => res.json()) );
  }

  add(token, data):Observable<any>{
    let params = JSON.stringify(data);
    console.log("params: ", params);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

      return this._http.post(this.url+'rol?token='+token, params, options)
                       .pipe( map(res => res.json()) );
  }


  edit(token, id) {
      return this._http.get(this.url+'rol/'+id+'?token='+token)
                       .pipe( map(res => res.json()) );

  }

  update(token, data): Observable<any> {
    let params = JSON.stringify(data);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

      return this._http.put(this.url+'rol/'+data.id+'?token='+token, params, options)
                       .pipe( map(res => res.json()) );

  }

}

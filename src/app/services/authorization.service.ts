import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {
  }

  public logout(): Observable<unknown> {
    return this.http.get('/API/authorization/logout');
  }

  public signIn(login: any, password: any): Observable<unknown> {
    return this.http.post('/API/authorization/authorize',
      {
        "login": login.value,
        "password": password.value
      });
  }
}

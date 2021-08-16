import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  loginStatus!: LoginStatus;

  constructor(private http: HttpClient) {
  }

  public getLoginStatus(): Observable<LoginStatus> {
    return new Observable<LoginStatus>((observer) => {
      if (this.loginStatus) {
        observer.next(this.loginStatus);
      } else {
        this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
          this.loginStatus = value;
          observer.next(this.loginStatus);
        });
      }
    });
  }

  public getNewLoginStatus(): Observable<LoginStatus> {
    return new Observable<LoginStatus>((observer) => {
      this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
        this.loginStatus = value;
        observer.next(this.loginStatus);
      });
    });
  }
}

interface LoginStatus {
  logged: boolean;
  rbac: string;
  nickname: string;
}

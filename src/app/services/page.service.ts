import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  loginStatusOrig!: LoginStatus;
  get loginStatus(): LoginStatus {
    if (!this.loginStatusOrig) {
      this.getLoginStatus().subscribe((value) => {
        this.loginStatusOrig = value;
        return this.loginStatusOrig;
      })
    }
    return this.loginStatusOrig;
  }
  set loginStatus(value: LoginStatus) {
    this.loginStatusOrig = value;
  }


  constructor(private http: HttpClient) {
  }

  public getLoginStatus(): Observable<LoginStatus> {
    return new Observable<LoginStatus>((observer) => {
      if (this.loginStatusOrig) {
        observer.next(this.loginStatusOrig);
      } else {
        this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
          this.loginStatusOrig = value;
          observer.next(this.loginStatusOrig);
        });
      }
    });
  }

  public getNewLoginStatus(): Observable<LoginStatus> {
    return new Observable<LoginStatus>((observer) => {
      this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
        this.loginStatusOrig = value;
        observer.next(this.loginStatusOrig);
      });
    });
  }
}

interface LoginStatus {
  logged: boolean;
  rbac: 'STANDARD_USER' | 'MODERATOR' | 'ADMINISTRATOR';
  nickname: string;
  id: number;
}

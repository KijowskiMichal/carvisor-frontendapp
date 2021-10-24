import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public postNewUser(image: string, name: string, surname: string, nick: string, phoneNumber: number, password: string): Observable<unknown> {
    return this.http.post('/API/users/addUser/',
      {
        "image": image,
        "name": name,
        "surname": surname,
        "nick": nick,
        "phoneNumber": phoneNumber,
        "password": password
      });
  }

  public getUserInfo(id: number): Observable<UserInfo> {
    return this.http.get<UserInfo>('/API/users/getUserData/' + id + '/');
  }

  public putUserImage(id: number, canvas: HTMLCanvasElement): Observable<unknown> {
    return this.http.post('/API/users/changeUserImage/' + id + '/',
      {
        "image": canvas.toDataURL()
      });
  }

  public putUserInfo(id: number, name: string, phone: string): Observable<unknown> {
    return this.http.post('/API/users/changeUserData/' + id + '/',
      {
        "name": name,
        "phoneNumber": phone
      });
  }

  public deleteUser(id: number): Observable<unknown> {
    return this.http.delete('/API/users/removeUser/' + id + '/');
  }

  public changePassword(first: HTMLInputElement, second: HTMLInputElement): Observable<unknown> {
    return this.http.post('/API/users/changePassword',
      {
        "firstPassword": first.value,
        "secondPassword": second.value
      });
  }

  public changePasswordOfUser(id: number, first: string, second: string): Observable<unknown> {
    return this.http.post('/API/users/changePassword/' + id + '/',
      {
        "firstPassword": first,
        "secondPassword": second
      });
  }

  public getListOfUsers(page: number, pageSize: number, regex: string): Observable<ListOfUser> {
    return this.http.get<ListOfUser>('/API/users/list/' + page + '/' + pageSize + '/' + regex + '/');
  }

}

export interface UserInfo {
  userPrivileges: number;
  name: string;
  phoneNumber: number;
  image: string;
}

export interface User {
  nick: string;
  image: string;
  finishTime: string;
  licensePlate: string;
  distance: number;
  surname: string;
  name: string;
  startTime: string;
  id: number;
  status: string;
}

export interface ListOfUser {
  page: number;
  listOfUsers: User[];
  pageMax: number;
}

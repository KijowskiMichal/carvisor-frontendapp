import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SafetyService {

  constructor(private http: HttpClient) {
  }

  public listSafetyPoints(page: number, pageSize: number, regex: string): Observable<ListOfSafety> {
    return this.http.get<ListOfSafety>('API/safetyPoints/list/' + page + '/' + pageSize + '/' + regex + '/');
  }
}

export interface ListOfUser {
  rate: number;
  surname: string;
  name: string;
  id: number;
  tracks: number;
}

export interface ListOfSafety {
  page: number;
  listOfUsers: ListOfUser[];
  pageMax: number;
}

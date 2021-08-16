import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EcoService {

  constructor(private http: HttpClient) {
  }

  public listEcoPoints(page: number, pageSize: number, regex: string): Observable<ListOfEco> {
    return this.http.get<ListOfEco>('/API/ecoPoints/list/' + page + '/' + pageSize + '/' + regex + '/');
  }
}
export interface ListOfEco {
  page: number;
  listOfUsers: ListOfUser[];
  pageMax: number;
}

export interface ListOfUser {
  revolutions: number;
  combustion: number;
  rate: number;
  surname: string;
  name: string;
  id: number;
  tracks: number;
  speed: number;
}

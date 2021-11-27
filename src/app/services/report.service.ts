import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {
  }

  public getReports(page: number, pageSize: number, regex: string): Observable<ListOfReports> {
    return this.http.get<ListOfReports>('/API/raports/list/' + page + '/' + pageSize + '/' + regex + '/');
  }

  public addReport(type: string, name: string, description: string, start: number,
                   end: number, listOfUserIds: number[]): Observable<unknown> {
    return this.http.post('/API/raports/add/',
      {
        "type": type, //TRACK, ECO, SAFETY
        "name": name,
        "description": description,
        "start": start,
        "end": end,
        "listOfUserIds": listOfUserIds
      });
  }

  public deleteReport(id: number): Observable<unknown> {
    return this.http.delete('/API/raports/remove/' + id + '/');
  }

  public getListOfUser(regex: string): Observable<ListNames[]> {
    return this.http.get<ListNames[]>('/API/users/listUserNames/'+ regex +'/');
  }
}

export interface ListOfReport {
  id: number;
  type: string;
  name: string;
  description: string;
  loading: boolean;
}

export interface ListOfReports {
  page: number;
  pageMax: number;
  listOfRaports: ListOfReport[];
}

export interface ListNames {
  image: string;
  name: string;
  id: number;
}

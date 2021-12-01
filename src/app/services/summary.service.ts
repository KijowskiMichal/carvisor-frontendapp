import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListOfSafety} from "./safety.service";

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(private http: HttpClient) {
  }

  public getSummary(dateFrom: number, dateTo: number, page: number, pageSize: number): Observable<Summary> {
    return this.http.get<Summary>('API/ranking/getUserSummary/' + dateFrom + '/' + dateTo + '/' + page + '/' + pageSize + '/');
  }

}

export interface ListOfOffencess {
  time: string;
  important: boolean;
  type: string;
  value: number;
  location: string;
}

export interface ListOfTrack {
  date: string;
  locationFrom: string;
  locationTo: string;
  safetyPoints: number;
  ecoPoints: number;
  listOfOffencess: ListOfOffencess[];
}

export interface Summary {
  name: string;
  safetyPoints: number;
  ecoPoints: number;
  safetyRankingPosition: number;
  ecoRankingPosition: number;
  listOfTracks: ListOfTrack[];
  page: number;
  pageMax: number;
}

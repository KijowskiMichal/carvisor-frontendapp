import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor(private http: HttpClient) {
  }

  public getListOfTracks(id: number, page: number, pageSize: number, dateFromValue: string,
                         dateToValue: string): Observable<ListOfTracks> {
    return this.http.get<ListOfTracks>('/API/track/list/' + id + '/'
      + page + '/' + pageSize + '/' + dateFromValue + '/' + dateToValue + '/');
  }

  public getReverseGeocoding(coords: string[]): Observable<Address> {
    return this.http.get<Address>('/API/track/reverseGeocoding/' + coords[0] + '/' + coords[1] + '/');
  }
}

export interface ListOfTrack {
  distance: number;
  start: number;
  from: string;
  end: number;
  id: number;
  to: string;
}

export interface ListOfTracks {
  page: number;
  user: string;
  pageMax: number;
  listOfTracks: ListOfTrack[];
}

export interface Address {
  address: string;
}


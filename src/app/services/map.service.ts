import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private http: HttpClient) {
  }

  public getListOfUser(regex: string): Observable<listNames[]> {
    return this.http.get<listNames[]>('/API/users/listUserNames/'+ regex +'/');
  }

  public getTrackData(userID: number, dateValue: string): Observable<Rate> {
    return this.http.get<Rate>('/API/track/getTrackData/'+ userID +'/'+ dateValue +'/');
  }
}

export interface StartPoint {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
  vehicle: string;
}

export interface Point {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
  track: number;
}

export interface EndPoint {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
  vehicle: string;
}

export interface listNames {
  image: string;
  name: string;
  id: number;
}

export interface Rate {
  startPoints: StartPoint[];
  points: Point[];
  endPoints: EndPoint[];
}

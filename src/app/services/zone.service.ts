import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private http: HttpClient) {
  }

  public getZones(regex: string): Observable<Zones[]> {
    return this.http.get<Zones[]>('/API/zones/list/' + regex + '/');
  }

  public getZone(id: number): Observable<ZoneDesc> {
    return this.http.get<ZoneDesc>('/API/zones/getZone/' + id + '/');
  }

  public putZone(id: number, name: string, pointX: string, pointY: string, radius: number): Observable<unknown> {
    return this.http.post('/API/zones/updateZone/' + id + '/',
      {
        "name": name,
        "pointX": pointX,
        "pointY": pointY,
        "radius": radius
      });
  }

  public addZone(name: string, pointX: string, pointY: string, radius: number): Observable<unknown> {
    return this.http.post('/API/zones/add/',
      {
        "name": name,
        "pointX": pointX,
        "pointY": pointY,
        "radius": radius
      });
  }

  public deleteZone(id: number): Observable<unknown> {
    return this.http.delete('/API/zones/remove/' + id + '/');
  }
}

export interface ZoneDesc {
  name: string;
  pointX: string;
  pointY: string;
  radius: number;
}

export interface Zones {
  id: number,
  name: string;
}

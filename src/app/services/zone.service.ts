import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "./notification.service";

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

  public getReverseGeocoding(coords: string[]): Observable<Address> {
    return this.http.get<Address>('/API/track/reverseGeocoding/' + coords[0] + '/' + coords[1] + '/');
  }
}

export interface ZoneDesc {
  name: string;
  pointX: string;
  pointY: string;
  radius: number;
}

export interface Zones {
  id: number;
  name: string;
  pointX: string;
  pointY: string;
  radius: number;
  location: string;
}

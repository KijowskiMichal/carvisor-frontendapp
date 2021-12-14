import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  public listNotifications(page: number, pageSize: number, dateFrom: number, dateTo: number): Observable<Notifications> {
    return this.http.get<Notifications>('API/notification/getNotification/' + dateFrom + '/' + dateTo + '/' + page + '/' + pageSize + '/');
  }

  public listWarnings(page: number, pageSize: number, dateFrom: number, dateTo: number): Observable<Warnings> {
    return this.http.get<Warnings>('API/errors/getErrors/' + dateFrom + '/' + dateTo + '/' + page + '/' + pageSize + '/');
  }

  public getReverseGeocoding(coords: string[]): Observable<Address> {
    return this.http.get<Address>('/API/track/reverseGeocoding/' + coords[0] + '/' + coords[1] + '/');
  }

}

export interface ListOfWarning {
  value: string; //brak typów
  date: number;
  location: string;
  userID: number;
  deviceID: number;
  userName: string;
  deviceLicensePlate: string;
  locationEncoded: string;
}

export interface Warnings {
  page: number;
  pageMax: number;
  listOfNotification: ListOfWarning[];
}

export interface ListOfNotification {
  type: string; //SPEEDING, LEAVING_THE_ZONE
  value: number;
  date: number;
  location: string;
  userID: number;
  deviceID: number;
  userName: string;
  deviceLicensePlate: string;
  locationEncoded: string;
}

export interface Notifications {
  page: number;
  pageMax: number;
  listOfNotification: ListOfNotification[];
}

export interface Address {
  address: string;
}

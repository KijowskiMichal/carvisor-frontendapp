import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ListOfSafety} from "./safety.service";

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

}

export interface ListOfWarning {
  type: string;
  value: number;
  date: number;
  location: string;
  userID: number;
  deviceID: number;
  userName: string;
  deviceLicensePlate: string;
}

export interface Warnings {
  page: number;
  pageMax: number;
  listOfNotification: ListOfWarning[];
}

export interface ListOfNotification {
  type: string;
  value: number;
  date: number;
  location: string;
  userID: number;
  deviceID: number;
  userName: string;
  deviceLicensePlate: string;
}

export interface Notifications {
  page: number;
  pageMax: number;
  listOfNotification: ListOfNotification[];
}

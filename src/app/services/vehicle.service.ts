import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) {
  }

  public getDeviceInfo(id: number): Observable<DeviceInfo> {
    return this.http.get<DeviceInfo>('/API/devices/getDeviceData/' + id + '/');
  }

  public getGlobalConfiguration(): Observable<GlobalConfiguration> {
    return this.http.get<GlobalConfiguration>('/API/carConfiguration/getGlobalConfiguration/');
  }

  public getConfiguration(id: number): Observable<Configuration> {
    return this.http.get<Configuration>('/API/carConfiguration/getConfiguration/'+ id + '/');
  }

  public putDeviceInfo(id: number, timeFrom: string, licensePlate: string, timeTo: string, engine: string, fuel: string,
    yearOfProduction: number, model: string, tank: string, brand: string, norm: string): Observable<unknown> {
    return this.http.post('/API/devices/changeDeviceData/' + id + '/',
      {
        "timeFrom": timeFrom,
        "licensePlate": licensePlate,
        "timeTo": timeTo,
        "engine": engine,
        "fuel": fuel,
        "yearOfProduction": yearOfProduction,
        "model": model,
        "tank": tank,
        "brand": brand,
        "norm": norm
      });
  }

  public deleteDevice(id: number): Observable<unknown> {
    return this.http.delete('/devices/removeDevice/' + id + '/');
  }

  public putGlobalConfiguration(historyTimeout: string, sendInterval: string,
                                locationInterval: string): Observable<unknown> {
    return this.http.post('/API/carConfiguration/setGlobalConfiguration/',
      {
        "historyTimeout": historyTimeout,
        "sendInterval": sendInterval,
        "getLocationInterval": locationInterval
      });
  }

  public putConfiguration(id: number, sendInterval: string, locationInterval: string): Observable<unknown> {
    return this.http.post('/API/carConfiguration/changeConfiguration/'+ id + '/',
      {
        "sendInterval": sendInterval,
        "locationInterval": locationInterval
      });
  }

  public putDeviceImage(id: number, canvas: HTMLCanvasElement): Observable<unknown> {
    return this.http.post('/API/devices/changeDeviceImage/' + id + '/',
      {
        "image": canvas.toDataURL()
      });
  }

  public getListOfDevices(page: number, pageSize: number, regex: string): Observable<ListOfDevicesWrapper> {
    return this.http.get<ListOfDevicesWrapper>('/API/devices/list/' + page + '/' + pageSize + '/' + regex + '/');
  }
}

export interface DeviceInfo {
  timeFrom: string;
  licensePlate: string;
  timeTo: string;
  engine: string;
  fuel: string;
  yearOfProduction: string;
  model: string;
  tank: number;
  brand: string;
  norm: number;
  image: string;
}

export interface Configuration {
  sendInterval: number;
  locationInterval: number;
}

export interface GlobalConfiguration {
  historyTimeout: number;
  sendInterval: number;
  getLocationInterval: number;
}

export interface ListOfDevices {
  image: string;
  licensePlate: string;
  distance: number;
  model: string;
  id: number;
  brand: string;
  status: string;
}

export interface ListOfDevicesWrapper {
  page: number;
  listOfDevices: ListOfDevices[];
  pageMax: number;
}


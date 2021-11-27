import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient) {
  }

  public getEvents(month: number, year: number): Observable<EventDetail[]> {
    return this.http.get<EventDetail[]>('/API/calendar/get/' + month + '/' + year + '/');
  }

  public addEvent(start: number, end: number, title: string, description: string, type: string, device: number,
                  draggable: boolean, remind: boolean): Observable<unknown> {
    return this.http.post('/API/calendar/add/',
      {
        "start": start,
        "end": end,
        "title": title,
        "description": description,
        "type": type,
        "device": device,
        "draggable": draggable,
        "remind": remind
      });
  }

  public getEvent(id: number): Observable<EventDetail> {
    return this.http.get<EventDetail>('/API/calendar/getEvent/' + id + '/');
  }


  public getListOfDevice(regex: string): Observable<ListNames[]> {
    return this.http.get<ListNames[]>('/API/devices/listDevicesNames/'+ regex +'/');
  }

  public putEvent(id: number, start: number, end: number, title: string, description: string, type: string,
                  device: number, draggable: boolean, remind: boolean): Observable<unknown> {
    return this.http.post('/API/calendar/updateEvent/' + id + '/',
      {
        "id": id,
        "start": start,
        "end": end,
        "title": title,
        "description": description,
        "type": type,
        "device": device,
        "draggable": draggable,
        "remind": remind
      });
  }

  public deleteEvent(id: number): Observable<unknown> {
    return this.http.delete('/API/calendar/remove/' + id + '/');
  }
}

export interface EventDetail {
  id: number;
  start: number | Date;
  end: number | Date;
  title: string;
  description: string;
  type: string;
  device: number;
  color: string;
  draggable: boolean;
  remind: boolean;
}

export interface ListNames {
  image: string;
  name: string;
  id: number;
}

import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

interface DeviceInfo {
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

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss']
})
export class EditVehicleComponent implements OnInit {
  private routeSub: Subscription;
  private id:number;
  deviceInfo: DeviceInfo;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.http.get<DeviceInfo>('/API/devices/getDeviceData/' + this.id + '/').subscribe(value => {
        this.deviceInfo = value;
      });
    });
  }

  sendData(timeFrom:string, licensePlate:string, timeTo:string, engine:string, fuel:string, yearOfProduction:string, model:string, tank:number, brand:string, norm:number) {
    this.http.post('/API/devices/changeDeviceData/' + this.id + '/',
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
      })
      .subscribe(
        (val) => {
        },
        response => {
          this.popupFail = true;
        },
        () => {
          this.popupOk = true;
        });
  }

}

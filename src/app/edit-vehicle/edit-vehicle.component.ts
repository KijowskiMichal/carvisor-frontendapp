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

interface Configuration {
  sendInterval: number;
  locationInterval: number;
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
  configuration: Configuration;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.http.get<DeviceInfo>('/API/devices/getDeviceData/' + this.id + '/').subscribe(value => {
        this.deviceInfo = value;
      });
      this.http.get<Configuration>('/API/carConfiguration/getConfiguration/'+ this.id + '/').subscribe(value => {
        this.configuration = value;
      });
    });

  }

  sendData(timeFrom:string, licensePlate:string, timeTo:string, engine:string, fuel:string, yearOfProduction:string, model:string, tank:string, brand:string, norm:string, sendInterval:string, locationInterval:string) {
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
          this.http.post('/API/carConfiguration/changeConfiguration/'+ this.id + '/',
            {
              "sendInterval": sendInterval,
              "locationInterval": locationInterval
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
        });

  }

  onFileChanged(evt: Event) {
    const file = (<HTMLInputElement>evt.target).files[0];
    if (!file) {
      return false;
    }
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var maxW = 400;
    var maxH = 400;
    var img = document.createElement('img');
    var selff = this;
    img.onload = function() {
      var iw = img.width;
      var ih = img.height;
      var scale = Math.min((maxW / iw), (maxH / ih));
      var iwScaled = iw * scale;
      var ihScaled = ih * scale;
      canvas.width = iwScaled;
      canvas.height = ihScaled;
      context.drawImage(img, 0, 0, iwScaled, ihScaled);
      selff.http.post('/API/devices/changeDeviceData/' + selff.id + '/',
        {
          "image": canvas.toDataURL()
        })
        .subscribe(
          (val) => {
          },
          response => {
            selff.popupFail = true;
          },
          () => {
            selff.popupOk = true;
          });
    }
    img.src = URL.createObjectURL(file);
  }
}

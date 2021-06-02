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

  sendData(timeFromInput:HTMLInputElement, licensePlateInput:HTMLInputElement, timeToInput:HTMLInputElement, engineInput:HTMLInputElement,
           fuelInput:HTMLInputElement, yearOfProductionInput:HTMLInputElement, modelInput:HTMLInputElement, tankInput:HTMLInputElement,
           brandInput:HTMLInputElement, normInput:HTMLInputElement, sendInterval:string, locationInterval:string) {
    var timeFrom = timeFromInput.value;
    var licensePlate = licensePlateInput.value;
    var timeTo = timeToInput.value;
    var engine = engineInput.value;
    var fuel = fuelInput.value;
    var yearOfProduction = yearOfProductionInput.value;
    var model = modelInput.value;
    var tank = tankInput.value;
    var brand = brandInput.value;
    var norm = normInput.value;
    var allClear = true;
    timeFromInput.classList.remove('error');
    licensePlateInput.classList.remove('error');
    timeToInput.classList.remove('error');
    engineInput.classList.remove('error');
    fuelInput.classList.remove('error');
    yearOfProductionInput.classList.remove('error');
    modelInput.classList.remove('error');
    tankInput.classList.remove('error');
    brandInput.classList.remove('error');
    normInput.classList.remove('error');
    //validator
    /*if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeFrom)) {
      timeFromInput.focus();
      timeFromInput.classList.add('error');
      timeFromInput.value = "";
      timeFromInput.placeholder = "gg:mm";
      allClear = false;
    }*/
    if (!/^[A-Za-z0-9]{4,7}$/.test(licensePlate)) {
      licensePlateInput.focus();
      licensePlateInput.classList.add('error');
      licensePlateInput.value = "";
      licensePlateInput.placeholder = "Litery i cyfry od 4 do 7 znaków.";
      allClear = false;
    }
    /*if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeTo)) {
      timeToInput.focus();
      timeToInput.classList.add('error');
      timeToInput.value = "";
      timeToInput.placeholder = "gg:mm";
      allClear = false;
    }*/
    if (!/^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ .,:;]{2,30}$/.test(engine)) {
      engineInput.focus();
      engineInput.classList.add('error');
      engineInput.value = "";
      engineInput.placeholder = "Litery i cyfry od 2 do 30 znaków.";
      allClear = false;
    }
    if (!/^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ .,:;]{2,15}$/.test(fuel)) {
      fuelInput.focus();
      fuelInput.classList.add('error');
      fuelInput.value = "";
      fuelInput.placeholder = "Litery i cyfry od 2 do 15 znaków.";
      allClear = false;
    }
    if (!/^[1-2][0-9]{3}$/.test(yearOfProduction)) {
      yearOfProductionInput.focus();
      yearOfProductionInput.classList.add('error');
      yearOfProductionInput.value = "";
      yearOfProductionInput.placeholder = "Cztery cyfry.";
      allClear = false;
    }
    if (!/^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{2,15}$/.test(model)) {
      modelInput.focus();
      modelInput.classList.add('error');
      modelInput.value = "";
      modelInput.placeholder = "Litery i cyfry od 2 do 15 znaków.";
      allClear = false;
    }
    if (!/^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ ]{2,15}$/.test(brand)) {
      brandInput.focus();
      brandInput.classList.add('error');
      brandInput.value = "";
      brandInput.placeholder = "Litery i cyfry od 2 do 15 znaków.";
      allClear = false;
    }
    if (!/^[0-9]{0,5}(\.[0-9]{0,5})?$/.test(tank)) {
      tankInput.focus();
      tankInput.classList.add('error');
      tankInput.value = "";
      tankInput.placeholder = "Cyfry, kropka zamiast przecinka.";
      allClear = false;
    }
    if (!/^[0-9]{0,3}(\.[0-9]{0,5})?$/.test(norm)) {
      normInput.focus();
      normInput.classList.add('error');
      normInput.value = "";
      normInput.placeholder = "Cyfry, kropka zamiast przecinka.";
      allClear = false;
    }
    if (!allClear) return;
    //others
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
      selff.http.post('/API/devices/changeDeviceImage/' + selff.id + '/',
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

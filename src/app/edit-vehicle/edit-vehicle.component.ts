import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Configuration, DeviceInfo, VehicleService} from "../services/vehicle.service";

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.scss']
})
export class EditVehicleComponent implements OnInit {
  private routeSub!: Subscription;
  private id!:number;
  deviceInfo!: DeviceInfo;
  configuration!: Configuration;
  constructor(private vehicleService: VehicleService, private route: ActivatedRoute) { }

  popupText = "To się nie powinno wyświetlać.";
  popupOk = false;
  popupFail = false;
  popupDelete = false;
  complete!: boolean;

  ngOnInit(): void {
    this.complete = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.vehicleService.getDeviceInfo(this.id).subscribe(value => {
        this.deviceInfo = value;
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
      this.vehicleService.getConfiguration(this.id).subscribe(value => {
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
    if (!/^[0-9]{2}:[0-9]{2}$/.test(timeFrom)) {
      timeFromInput.focus();
      timeFromInput.classList.add('error');
      timeFromInput.value = "";
      timeFromInput.placeholder = "gg:mm";
      allClear = false;
    }
    if (!/^[A-Za-z0-9]{4,7}$/.test(licensePlate)) {
      licensePlateInput.focus();
      licensePlateInput.classList.add('error');
      licensePlateInput.value = "";
      licensePlateInput.placeholder = "Litery i cyfry od 4 do 7 znaków.";
      allClear = false;
    }
    if (!/^[0-9]{2}:[0-9]{2}$/.test(timeTo)) {
      timeToInput.focus();
      timeToInput.classList.add('error');
      timeToInput.value = "";
      timeToInput.placeholder = "gg:mm";
      allClear = false;
    }
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
    if (!/^[0-9]{1,5}$/.test(tank)) {
      tankInput.focus();
      tankInput.classList.add('error');
      tankInput.value = "";
      tankInput.placeholder = "Cyfry, od 1 do 5 znaków.";
      allClear = false;
    }
    if (!/^[0-9]{1,3}(\.[0-9]{0,5})?$/.test(norm)) {
      normInput.focus();
      normInput.classList.add('error');
      normInput.value = "";
      normInput.placeholder = "Cyfry, kropka zamiast przecinka.";
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.vehicleService.putDeviceInfo(this.id, timeFrom, licensePlate, timeTo, engine, fuel, Number.parseInt(yearOfProduction),
      model, tank, brand, norm).subscribe(
        () => {
        },
        () => {
          this.popupFail = true;
        },
        () => {
          this.vehicleService.putConfiguration(this.id, sendInterval, locationInterval).subscribe(
              () => {
              },
              () => {
                this.popupFail = true;
              },
              () => {
                this.popupText = "Pomyślnie zaktualizowano pojazd.";
                this.popupOk = true;
              });
        });

  }

  onFileChanged(evt: Event) {
    if ((<HTMLInputElement>evt.target).files) {
      const file = (<HTMLInputElement>evt.target).files?.item(0);
      if (!file) {
        return false;
      }
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let maxW = 400;
      let maxH = 400;
      let img = document.createElement('img');
      let selff = this;
      img.onload = function () {
        let iw = img.width;
        let ih = img.height;
        let scale = Math.max((maxW / iw), (maxH / ih));
        let iwScaled = iw * scale;
        let ihScaled = ih * scale;
        let minSize = Math.min(iwScaled, ihScaled);
        canvas.width = minSize;
        canvas.height = minSize;
        context?.rect(0, 0, minSize, minSize);
        context?.stroke();
        context?.clip();
        context?.drawImage(img, 0, 0, iwScaled, ihScaled);
        selff.vehicleService.putDeviceImage(selff.id, canvas).subscribe(
            () => {
            },
          () => {
              selff.popupFail = true;
            },
            () => {
              selff.popupOk = true;
            });
      }
      img.src = URL.createObjectURL(file);
    }
  }

  deleteDevice() {
    this.popupDelete = false;
    this.vehicleService.deleteDevice(this.id).subscribe(
      () => {
      },
      () => {
        this.popupFail = true;
      },
      () => {
        this.popupText = "Pomyślnie usunięto pojazd.";
        this.popupOk = true;
      });
  }
}

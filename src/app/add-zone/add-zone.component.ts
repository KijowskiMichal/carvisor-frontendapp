import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ZoneService} from "../services/zone.service";

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  popupOk = false;
  popupFail = false;

  constructor(public zoneService: ZoneService) {}

  ngOnInit(): void {
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }

  sendForm(name:HTMLInputElement, pointX:HTMLInputElement, pointY:HTMLInputElement, radius:HTMLInputElement) {
    let nameValue = name.value;
    let pointXValue = pointX.value;
    let pointYValue = pointY.value;
    let radiusValue = radius.value;
    let allClear = true;
    name.classList.remove('error');
    pointX.classList.remove('error');
    pointY.classList.remove('error');
    radius.classList.remove('error');
    //validator
    if (!/^.{3,30}$/.test(name.value)) {
      name.focus();
      name.classList.add('error');
      name.value = "";
      name.placeholder = "Od 3 do 30 znaków.";
      allClear = false;
    }
    if (!/^(-?\d+(\.\d+)?)$/.test(pointX.value)) {
      pointX.focus();
      pointX.classList.add('error');
      pointX.value = "";
      pointX.placeholder = "Podaj prawidłową wartość współrzędniej.";
      allClear = false;
    }
    if (!/^(-?\d+(\.\d+)?)$/.test(pointY.value)) {
      pointY.focus();
      pointY.classList.add('error');
      pointY.value = "";
      pointY.placeholder = "Podaj prawidłową wartość współrzędniej.";
      allClear = false;
    }
    if (!/^\d+$/.test(radius.value)) {
      radius.focus();
      radius.classList.add('error');
      radius.value = "";
      radius.placeholder = "Liczba musi być naturalna.";
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.zoneService.addZone(nameValue, pointXValue, pointYValue, Number(radiusValue)).subscribe(
      () => {
      },
      () => {
        this.closeWindow();
        this.popupFail = true;
      },
      () => {
        this.closeWindow();
        this.popupOk = true;
      });
  }

}

import { Component, OnInit } from '@angular/core';
import {GlobalConfiguration, VehicleService} from "../services/vehicle.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  globalConfiguration!: GlobalConfiguration;
  constructor(private vehicleService: VehicleService, private userService: UserService) { }

  popup = false;
  popupOk = false;
  popupFail = false;
  addUserPopup: boolean;
  addZonePopup: boolean;

  ngOnInit(): void {
    this.vehicleService.getGlobalConfiguration().subscribe(value => {
      this.globalConfiguration = value;
    });
  }

  changePassword(first:HTMLInputElement, second:HTMLInputElement) {
    var allClear = true;
    if (!/^.{5,30}$/.test(first.value)) {
      first.focus();
      first.style.border = 'solid #ef476f 1px';
      first.value = "";
      first.placeholder = "Długość od 5 do 30 znaków.";
      allClear = false;
    }
    if (!/^.{5,30}$/.test(second.value)) {
      second.focus();
      second.style.border = 'solid #ef476f 1px';
      second.value = "";
      second.placeholder = "Długość od 5 do 30 znaków.";
      allClear = false;
    }
    if (!allClear) return;
      this.userService.changePassword(first, second).subscribe(
        () => {
        },
        () => {
          first.style.border = 'solid #ef476f 1px';
          first.value = '';
          first.setAttribute('placeholder', 'Hasła się nie zgadzają!');
          second.style.border = 'solid #ef476f 1px';
          second.value = '';
          second.setAttribute('placeholder', 'Hasła się nie zgadzają!');
        },
        () => {
          this.popup = true;
        });
  }

  sendData(historyTimeout:string, sendInterval:string, locationInterval:string) {
    this.vehicleService.putGlobalConfiguration(historyTimeout, sendInterval, locationInterval).subscribe(
        () => {
        },
        () => {
          this.popupFail = true;
        },
        () => {
          this.popupOk = true;
        });
  }

}

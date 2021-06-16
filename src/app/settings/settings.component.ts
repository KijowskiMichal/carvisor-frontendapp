import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

interface GlobalConfiguration {
  historyTimeout: number;
  sendInterval: number;
  getLocationInterval: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  globalConfiguration: GlobalConfiguration;
  constructor(private http:HttpClient, private router:Router) { }

  popup = false;
  popupOk = false;
  popupFail = false;
  addUserPopup: boolean;

  ngOnInit(): void {
    this.http.get<GlobalConfiguration>('/API/carConfiguration/getGlobalConfiguration/').subscribe(value => {
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
      this.http.post('/API/users/changePassword',
      {
        "firstPassword": first.value,
        "secondPassword": second.value
      })
      .subscribe(
        (val) => {
        },
        response => {
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
    this.http.post('/API/carConfiguration/setGlobalConfiguration/',
      {
        "historyTimeout": historyTimeout,
        "sendInterval": sendInterval,
        "getLocationInterval": locationInterval
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

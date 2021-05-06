import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

interface GlobalConfiguration {
  historyTimeout: number;
  sendInterval: number;
  locationInterval: number;
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

  ngOnInit(): void
  {
    this.http.get<GlobalConfiguration>('/API/carConfiguration/getGlobalConfiguration/').subscribe(value => {
      this.globalConfiguration = value;
    });
  }

  changePassword(first:any, second:any) {
      this.http.post('/API/users/changePassword',
      {
        "firstPassword": first.value,
        "secondPassword": second.value
      })
      .subscribe(
        (val) => {
        },
        response => {
          (first as HTMLElement).style.border = 'solid #ef476f 1px';
          first.value = '';
          (first as HTMLElement).setAttribute('placeholder', 'Hasła się nie zgadzają!');
          (second as HTMLElement).style.border = 'solid #ef476f 1px';
          second.value = '';
          (second as HTMLElement).setAttribute('placeholder', 'Hasła się nie zgadzają!');
        },
        () => {
          this.popup = true;
        });
  }

  sendData(historyTimeout:string, sendInterval:string, locationInterval:string) {
    this.http.post('/API/carConfiguration/changeGlobalConfiguration/',
      {
        "historyTimeout": historyTimeout,
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
  }

}

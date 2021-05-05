import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router) { }

  popup = false;

  ngOnInit(): void {
  }

  changePassword(first:any, second:any)
  {
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

}

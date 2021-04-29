import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable } from "rxjs";

interface LoginStatus{
  Logged:boolean,
  Nickname:string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
      if (value.Logged==true)
      {
        this.router.navigate(['./users']);
      }
    });
  }

  signIn(login:any, password:any, user:any, key:any)
  {
    this.http.post('/API/authorization/authorize',
      {
        "login": login.value,
        "password": password.value
      })
      .subscribe(
        (val) => {
        },
        response => {
          (user as HTMLElement).style.color = '#ef476f';
          (key as HTMLElement).style.color = '#ef476f';
          (login as HTMLElement).style.border = 'solid #ef476f 1px';
          login.value = '';
          (login as HTMLElement).setAttribute('placeholder', 'Błędne dane logowania!');
          (password as HTMLElement).style.border = 'solid #ef476f 1px';
          password.value = '';
          (password as HTMLElement).setAttribute('placeholder', 'Błędne dane logowania!');
        },
        () => {
          this.router.navigate(['./users']);
        });
  }

}

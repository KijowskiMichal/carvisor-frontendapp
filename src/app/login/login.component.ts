import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }

  signIn(login:String, password:String)
  {
    this.http.post("https://michal.vps.kronmar.net/API/authorization/authorize",
      {
        "login": login,
        "password": password
      })
      .subscribe(
        (val) => {
          console.log("POST call successful value returned in body",
            val);
        },
        response => {
          console.log("POST call in error", response);
        },
        () => {
          console.log("The POST observable is now completed.");
        });
  }

}

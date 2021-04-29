import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable } from "rxjs";

interface LoginStatus{
  Logged:boolean,
  Nickname:string
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void
  {
      this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
        if (value.Logged==false)
        {
          this.router.navigate(['./']);
        }
      });
  }

}

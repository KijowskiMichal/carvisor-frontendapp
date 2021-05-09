import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface LoginStatus {
  logged: boolean;
  rbac: string;
  nickname: string;
}

interface User {
  nick: string;
  image: string;
  finishTime: string;
  licensePlate: string;
  distance: number;
  surname: string;
  name: string;
  startTime: string;
  id: number;
  status: string;
}

interface ListOfUser {
  page: number;
  listOfUsers: User[];
  pageMax: number;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  listOfUser: ListOfUser;
  page: number;
  pageMax: number;
  pageSize = 6;

  ngOnInit(): void
  {
    this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
      if (!value.logged)
      {
        this.router.navigate(['./']);
      }
    });
    this.list(1, '$');
  }

  public list(page: number, regex: string): void
  {
    if (regex === '')
    {
      regex = '$';
    }
    if (page >= 1)
    {
      this.http.get<ListOfUser>('/API/users/list/' + page + '/' + this.pageSize + '/' + regex + '/').subscribe(value => {
        if (page <= value.pageMax)
        {
          this.listOfUser = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}



import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

interface LoginStatus {
  logged: boolean;
  rbac: string;
  nickname: string;
}

interface ListOfUser {
  revolutions: number;
  combustion: number;
  rate: number;
  surname: string;
  name: string;
  id: number;
  tracks: number;
  speed: number;
}

interface ListOfEco {
  page: number;
  listOfUsers: ListOfUser[];
  pageMax: number;
}

@Component({
  selector: 'app-ecodrive',
  templateUrl: './ecodrive.component.html',
  styleUrls: ['./ecodrive.component.scss']
})
export class EcodriveComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  listOfUsers: ListOfEco;
  page: number;
  pageMax: number;
  pageSize = 6;

  ngOnInit(): void {
    this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list(1, '$');
  }

  public list(page: number, regex: string): void {
    if (regex === '') {
      regex = '$';
    }
    if (page >= 1) {
      this.http.get<ListOfEco>('/API/ecoPoints/list/' + page + '/' + this.pageSize + '/' + regex + '/').subscribe(value => {
        if (page <= value.pageMax) {
          this.listOfUsers = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

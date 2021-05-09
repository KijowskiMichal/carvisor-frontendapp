import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})

export class VehiclesComponent implements OnInit {
  listOfDevicesWrapper: ListOfDevicesWrapper;
  page: number;
  pageMax: number;
  pageSize = 6;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
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
      this.http.get<ListOfDevicesWrapper>('/API/devices/list/' + page + '/' + this.pageSize + '/' + regex + '/').subscribe(value => {
        if (page <= value.pageMax)
        {
          this.listOfDevicesWrapper = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

interface ListOfDevices {
  image: string;
  licensePlate: string;
  distance: number;
  model: string;
  id: number;
  brand: string;
  status: string;
}

interface ListOfDevicesWrapper {
  page: number;
  listOfDevices: ListOfDevices[];
  pageMax: number;
}

interface LoginStatus {
  logged: boolean;
  rbac: string;
  nickname: string;
}

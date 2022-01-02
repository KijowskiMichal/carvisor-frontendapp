import { Component, OnInit } from '@angular/core';
import {ListOfDevicesWrapper, VehicleService} from "../services/vehicle.service";

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})

export class VehiclesComponent implements OnInit {
  listOfDevicesWrapper!: ListOfDevicesWrapper;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  complete!: boolean;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.list(1, '$');
  }

  public list(page: number, regex: string): void
  {
    this.complete = false;
    if (regex === '') {
      regex = '$';
    }
    if (page >= 1) {
      this.vehicleService.getListOfDevices(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax)
        {
          this.listOfDevicesWrapper = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
    }
  }

}

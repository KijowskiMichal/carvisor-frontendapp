import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {NotificationService, Warnings} from "../services/notification.service";

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss']
})
export class WarningsComponent implements OnInit {

  constructor(private notificationService: NotificationService, public datePipe: DatePipe) { }
  Warnings!: Warnings;
  dateFromValue!: string;
  dateFromTimestamp!: number;
  dateToValue!: string;
  dateToTimestamp!: number;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  complete!: boolean;

  ngOnInit(): void {
    this.dateFromValue = this.datePipe.transform(new Date((new Date()).getTime() - 1209600000), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.list(1);
  }

  public list(page: number): void {
    this.complete = false;
    if (page >= 1) {
      this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
      this.dateToTimestamp = (new Date(this.dateToValue).valueOf() / 1000) + 86399;
      this.notificationService.listWarnings(page, this.pageSize, this.dateFromTimestamp, this.dateToTimestamp).subscribe(value => {
        if (page <= value.pageMax) {
          this.Warnings = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
          for (let warning of this.Warnings.listOfNotification) {
            let coords = warning.location.split(";");
            this.notificationService.getReverseGeocoding(coords).subscribe(value => {
              warning.locationEncoded =  value.address;
            });
          }
        }
        else if (value.pageMax === 0) {
          this.Warnings = null;
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

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {Notifications, NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationService: NotificationService, private pageService: PageService,
              private router: Router, private datePipe: DatePipe) { }
  Notifications!: Notifications;
  dateFromValue!: string;
  dateFromTimestamp!: number;
  dateToValue!: string;
  dateToTimestamp!: number;
  page!: number;
  pageMax!: number;
  pageSize = 6;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.list(1);
  }

  public list(page: number): void {
    if (page >= 1) {
      this.dateFromTimestamp = new Date(this.dateFromValue).valueOf();
      this.dateToTimestamp = new Date(this.dateToValue).valueOf();
      this.notificationService.listNotifications(page, this.pageSize, this.dateFromTimestamp, this.dateToTimestamp).subscribe(value => {
        if (page <= value.pageMax) {
          this.Notifications = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

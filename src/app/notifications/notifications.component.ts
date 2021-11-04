import { Component, OnInit } from '@angular/core';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {Notifications, NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(private notificationService: NotificationService, private pageService: PageService, private router: Router) { }
  Notifications!: Notifications;
  dateFromValue!: number;
  dateToValue!: number;
  page!: number;
  pageMax!: number;
  pageSize = 6;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list(1);
  }

  public list(page: number): void {
    if (page >= 1) {
      this.notificationService.listNotifications(page, this.pageSize, this.dateFromValue, this.dateToValue).subscribe(value => {
        if (page <= value.pageMax) {
          this.Notifications = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {NotificationService, Warnings} from "../services/notification.service";
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss']
})
export class WarningsComponent implements OnInit {

  constructor(private notificationService: NotificationService, private pageService: PageService, private router: Router) { }
  Warnings!: Warnings;
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
    this.dateFromValue = new Date().valueOf();
    this.dateToValue = new Date().valueOf();
    this.list(1);
  }

  public list(page: number): void {
    if (page >= 1) {
      this.notificationService.listWarnings(page, this.pageSize, this.dateFromValue, this.dateToValue).subscribe(value => {
        if (page <= value.pageMax) {
          this.Warnings = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

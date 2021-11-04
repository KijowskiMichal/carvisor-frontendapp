import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.component.html',
  styleUrls: ['./warnings.component.scss']
})
export class WarningsComponent implements OnInit {

  constructor(private notificationService: NotificationService, private pageService: PageService, private router: Router) { }
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
    /*
    if (page >= 1) {
      this.notificationService.getNotification(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax) {
          this.listOfUsers = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
    */
  }

}
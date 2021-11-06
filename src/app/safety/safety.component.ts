import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PageService} from "../services/page.service";
import {ListOfSafety, SafetyService} from "../services/safety.service";

@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss']
})
export class SafetyComponent implements OnInit {

  constructor(private pageService: PageService, private safetyService: SafetyService, private router: Router) { }
  listOfUsers!: ListOfSafety;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  userPopup: boolean;
  userId: number;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
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
      this.safetyService.listSafetyPoints(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax) {
          this.listOfUsers = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {PageService} from "../services/page.service";
import {ListOfSafety, SafetyService} from "../services/safety.service";

@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss']
})
export class SafetyComponent implements OnInit {

  constructor(private pageService: PageService, private safetyService: SafetyService) { }
  listOfUsers!: ListOfSafety;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  userPopup: boolean;
  chartPopup: boolean;
  userId: number;
  complete!: boolean;

  ngOnInit(): void {
    this.list(1, '$');
  }

  public list(page: number, regex: string): void {
    this.complete = false;
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

import { Component, OnInit } from '@angular/core';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {ReportService, ListOfReports} from "../services/report.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private reportService: ReportService, private pageService: PageService, private router: Router) { }
  listOfReports!: ListOfReports;
  page!: number;
  pageMax!: number;
  pageSize = 10;

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
      this.reportService.getReports(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax) {
          this.listOfReports = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

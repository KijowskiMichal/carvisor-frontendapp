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

  popupOk = false;
  popupFail = false;
  popupDelete = false;

  idToDelete!: number;

  listOfReports!: ListOfReports;
  page!: number;
  pageMax!: number;
  pageSize = 10;
  complete!: boolean;

  addReportPopup: boolean;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list(1, '$');
  }

  public list(page: number, regex: string): void {
    this.complete = false;
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
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
    }
  }

  public deleteReport() {
    this.reportService.deleteReport(this.idToDelete).subscribe(
      () => {
        },
        () => {
          this.popupDelete = false;
          this.popupFail = true;
        },
        () => {
          this.popupDelete = false;
          this.popupOk = true;
        });
  }

  public refresh() {
    this.list(1, '$');
  }

  public getpdf(id: number) {
    this.reportService.getReport(id).subscribe(
      value => {
        this.download(value, '{type: "application/pdf"}')
      });
  }

  download(data: any, type: string) {
    var blob = new Blob([data], {type: type.toString()});
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Jeżeli raport nie otwiera się, to należy zezwolić w przeglądarce na otwieranie okien pop-up.');
    }
  }
}

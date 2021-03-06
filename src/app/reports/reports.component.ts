import { Component, OnInit } from '@angular/core';
import {ReportService, ListOfReports} from "../services/report.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(private reportService: ReportService) { }

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
        else if (value.pageMax === 0) {
          this.listOfReports = null;
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
    var file = new Blob([data], {type: 'application/pdf'});
    var fileURL = window.URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }
}

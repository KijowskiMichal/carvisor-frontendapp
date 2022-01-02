import { Component, OnInit } from '@angular/core';
import {DatePipe} from "@angular/common";
import {SummaryService, Summary} from "../services/summary.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  constructor(private summaryService: SummaryService, public datePipe: DatePipe) { }

  Summary!: Summary;
  dateFromValue!: string;
  dateFromTimestamp!: number;
  dateToValue!: string;
  dateToTimestamp!: number;
  page!: number;
  pageMax!: number;
  pageSize = 6;

  ngOnInit(): void {
    this.dateFromValue = this.datePipe.transform(new Date((new Date()).getTime() - 1209600000), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.list(1);
  }

  public list(page: number): void {
    if (page >= 1) {
      this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
      this.dateToTimestamp = new Date(this.dateToValue).valueOf() / 1000;
      this.summaryService.getSummary(this.dateFromTimestamp, this.dateToTimestamp, page, this.pageSize).subscribe(value => {
        if (page <= value.pageMax) {
          this.Summary = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
        else if (value.pageMax === 0) {
          this.Summary = null;
        }
      });
    }
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ReportService} from "../services/report.service";

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public datePipe: DatePipe, private reportService: ReportService) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {

  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }



}

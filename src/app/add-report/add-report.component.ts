import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {ListNames, ReportService} from "../services/report.service";

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
  page = 0;
  searchUsers: string;
  usersList: ListNames[];
  selectedUsers: Set<number> = new Set<number>();

  ngOnInit(): void {
    this.reportService.getListOfUser("$").subscribe((value) => {
      this.usersList = value
    });
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }


  changeSearch() {
    this.reportService.getListOfUser(this.searchUsers === "" ? "$" : this.searchUsers).subscribe((value) => {
      this.usersList = value
    });
  }

  changeStateOfUser(id: number) {
    if (this.selectedUsers.has(id)) {
      this.selectedUsers.delete(id);
    }
    else {
      this.selectedUsers.add(id);
    }
  }
}

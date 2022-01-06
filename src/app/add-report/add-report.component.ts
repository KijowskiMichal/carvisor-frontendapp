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
  dateFromValue!:string;
  dateToValue!:string;
  dateFromTimestamp!: number;
  dateToTimestamp!: number;

  nameValue!: string;
  descriptionValue!: string;
  typeValue = "";

  checkbox!: boolean;


  ngOnInit(): void {
    this.reportService.getListOfUser("$").subscribe((value) => {
      this.usersList = value
    });
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  shouldBeChecked(): boolean {
    this.usersList.forEach((user) => {
      if (!this.selectedUsers.has(user.id)) {
        return true;
      }
    })
    return false;
  }

  closeWindow() {
    this.nameValue = null;
    this.descriptionValue = null;
    this.typeValue = "";
    this.selectedUsers.clear();
    this.page = 0;
    this.checkbox = false;
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }

  changeSearch() {
    this.reportService.getListOfUser(this.searchUsers === "" ? "$" : this.searchUsers).subscribe((value) => {
      this.usersList = value;
      this.checkbox = this.shouldBeChecked();
    });
  }

  changeStateOfUser(id: number) {
    if (this.selectedUsers.has(id)) {
      this.selectedUsers.delete(id);
    }
    else {
      this.selectedUsers.add(id);
    }
    this.checkbox = this.shouldBeChecked();
  }

  checkPage0(name:HTMLInputElement, description:HTMLTextAreaElement, type:HTMLSelectElement) {
    this.nameValue = name.value;
    this.descriptionValue = description.value;
    this.typeValue = type.value;
    let allClear = true;
    name.classList.remove('error');
    description.classList.remove('error');
    type.classList.remove('error');
    //validator
    if (!/^.{3,60}$/.test(description.value)) {
      description.focus();
      description.classList.add('error');
      description.value = "";
      description.placeholder = "Od 3 do 60 znaków.";
      allClear = false;
    }
    if (!/^.{3,30}$/.test(name.value)) {
      name.focus();
      name.classList.add('error');
      name.value = "";
      name.placeholder = "Od 3 do 30 znaków.";
      allClear = false;
    }
    if (this.typeValue === "") {
      type.focus();
      type.classList.add('error');
      allClear = false;
    }
    if (!allClear) return;
    this.page = 1;
  }

  checkPage1() {
    if (this.selectedUsers.size > 0) {
      this.page = 2;
    }
    else {
      return;
    }
  }

  checkPage2(datefrom:HTMLInputElement, dateto:HTMLInputElement) {
    let allClear = true;
    this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
    this.dateToTimestamp = (new Date(this.dateToValue).valueOf() / 1000) + 86399;
    datefrom.classList.remove('error');
    dateto.classList.remove('error');
    if (this.dateFromTimestamp > this.dateToTimestamp) {
      datefrom.classList.add('error');
      dateto.classList.add('error');
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.reportService.addReport(this.typeValue, this.nameValue, this.descriptionValue, this.dateFromTimestamp, this.dateToTimestamp, Array.from(this.selectedUsers)).subscribe(
      () => {
      },
      () => {
        this.closeWindow();
        this.popupFail = true;
      },
      () => {
        this.closeWindow();
        this.popupOk = true;
      });
  }

  public refresh() {
    window.location.reload();
  }

  selectAll() {
    if (this.checkbox) {
      this.usersList.forEach((user) => {
        this.selectedUsers.add(user.id);
      })
    }
    else {
      this.selectedUsers.clear();
    }
  }
}

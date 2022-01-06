import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DatePipe } from '@angular/common';
import {EcoService, UserPoints} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive-user',
  templateUrl: './ecodrive-user.component.html',
  styleUrls: ['./ecodrive-user.component.scss']
})
export class EcodriveUserComponent implements OnInit {

  @Input() id;
  @Input() set popup(value: boolean) {
    this.popup_ = value;
    if (this.popup_ === true) {
      this.dateFromValue = this.datePipe.transform(new Date((new Date()).getTime() - 1209600000), 'yyyy-MM-dd');
      this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      if (this.id) this.list();
    }
    else {
      this.userPoints = null;
    }
  }
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  popup_ = false;
  userPoints!: UserPoints;
  dateFromValue!: string;
  dateFromTimestamp!: number;
  dateToValue!: string;
  dateToTimestamp!: number;

  constructor(private ecoService: EcoService, public datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  list() {
    this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
    this.dateToTimestamp = (new Date(this.dateToValue).valueOf() / 1000) + 86399;
    this.ecoService.getUserPoints(this.id, this.dateFromTimestamp, this.dateToTimestamp).subscribe(value => {
      this.userPoints = value;
    });
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }
}

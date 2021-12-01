import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {SafetyService, UserPoints} from "../services/safety.service";
import {DatePipe} from "@angular/common";
import {TrackService} from "../services/track.service";

@Component({
  selector: 'app-safety-user',
  templateUrl: './safety-user.component.html',
  styleUrls: ['./safety-user.component.scss']
})
export class SafetyUserComponent implements OnInit {

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

  constructor(private safetyService: SafetyService, private pageService: PageService, private router: Router,
              public datePipe: DatePipe, private trackService: TrackService) { }

  ngOnInit(): void {
  }

  list() {
    this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
    this.dateToTimestamp = new Date(this.dateToValue).valueOf() / 1000;
    this.safetyService.getUserPoints(this.id, this.dateFromTimestamp, this.dateToTimestamp).subscribe(value => {
      this.userPoints = value;
      for (let off of this.userPoints.listOfOffencess) {
        let coords = off.location.split(",");
        this.trackService.getReverseGeocoding(coords).subscribe(value => {
          off.location =  value.address;
        });
      }
    });
  }

  closeWindow() {
    this.popup_ = !(this.popup_);
    this.popupChange.emit(this.popup_);
  }

}

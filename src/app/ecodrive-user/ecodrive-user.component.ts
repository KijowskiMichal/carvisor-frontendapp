import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DatePipe } from '@angular/common';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {EcoService, UserPoints} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive-user',
  templateUrl: './ecodrive-user.component.html',
  styleUrls: ['./ecodrive-user.component.scss']
})
export class EcodriveUserComponent implements OnInit {

  @Input() id;
  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  userPoints!: UserPoints;
  dateFromValue!: string;
  dateFromTimestamp!: number;
  dateToValue!: string;
  dateToTimestamp!: number;

  constructor(private ecoService: EcoService, private pageService: PageService, private router: Router,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.list();
  }

  list() {
    this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
    this.dateToTimestamp = new Date(this.dateToValue).valueOf() / 1000;
    this.ecoService.getUserPoints(this.id, this.dateFromTimestamp, this.dateToTimestamp).subscribe(value => {
      this.userPoints = value;
    });
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }
}

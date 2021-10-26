import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {SafetyService} from "../services/safety.service";

@Component({
  selector: 'app-safety-user',
  templateUrl: './safety-user.component.html',
  styleUrls: ['./safety-user.component.scss']
})
export class SafetyUserComponent implements OnInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private safetyService: SafetyService, private pageService: PageService, private router: Router) { }

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";
import {EcoService} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive-user',
  templateUrl: './ecodrive-user.component.html',
  styleUrls: ['./ecodrive-user.component.scss']
})
export class EcodriveUserComponent implements OnInit {

  @Input() id;
  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private ecoService: EcoService, private pageService: PageService, private router: Router) { }

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

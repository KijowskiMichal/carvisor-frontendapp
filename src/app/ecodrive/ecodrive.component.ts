import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PageService} from "../services/page.service";
import {EcoService, ListOfEco} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive',
  templateUrl: './ecodrive.component.html',
  styleUrls: ['./ecodrive.component.scss']
})
export class EcodriveComponent implements OnInit {

  constructor(private ecoService: EcoService, private pageService: PageService, private router: Router) { }
  listOfUsers!: ListOfEco;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  userPopup: boolean;
  userId: number;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list(1, '$');
  }

  public list(page: number, regex: string): void {
    if (regex === '') {
      regex = '$';
    }
    if (page >= 1) {
      this.ecoService.listEcoPoints(page, this.pageSize, regex).subscribe(value => {
        if (page <= value.pageMax) {
          this.listOfUsers = value;
          this.page = value.page;
          this.pageMax = value.pageMax;
        }
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {EcoService, ListOfEco} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive',
  templateUrl: './ecodrive.component.html',
  styleUrls: ['./ecodrive.component.scss']
})
export class EcodriveComponent implements OnInit {

  constructor(private ecoService: EcoService) { }
  listOfUsers!: ListOfEco;
  page!: number;
  pageMax!: number;
  pageSize = 6;
  userPopup: boolean;
  chartPopup: boolean;
  userId: number;
  complete!: boolean;

  ngOnInit(): void {
    this.list(1, '$');
  }

  public list(page: number, regex: string): void {
    this.complete = false;
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
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
    }
  }

}

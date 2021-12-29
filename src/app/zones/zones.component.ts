import { Component, OnInit } from '@angular/core';
import {ZoneService, Zones} from "../services/zone.service";
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  constructor(private zoneService: ZoneService, private pageService: PageService, private router: Router) { }

  popupOk = false;
  popupFail = false;
  popupDelete = false;

  idToDelete!: number;

  listOfZones!: Zones[];
  complete!: boolean;

  addZonePopup: boolean;

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.list('$');
  }

  public list(regex: string): void {
    this.complete = false;
    if (regex === '') {
      regex = '$';
    }
    this.zoneService.getZones(regex).subscribe(value => {
        this.listOfZones = value;
        for (let zone of this.listOfZones) {
          let coords = [zone.pointX, zone.pointY];
          this.zoneService.getReverseGeocoding(coords).subscribe(value => {
            zone.location =  value.address;
          });
        }
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
  }

  public deleteZone() {
    this.zoneService.deleteZone(this.idToDelete).subscribe(
      () => {
      },
      () => {
        this.popupDelete = false;
        this.popupFail = true;
      },
      () => {
        this.popupDelete = false;
        this.popupOk = true;
      });
  }

  public refresh() {
    this.list('$');
  }

}

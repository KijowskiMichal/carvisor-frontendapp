import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {from, Subscription} from "rxjs";
import {ListOfTracks, TrackService} from "../services/track.service";
import {PageService} from "../services/page.service";

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {
  private routeSub!: Subscription;
  private id!:number;
  dateFromValue!: string;
  dateToValue!: string;
  listOfTracks!: ListOfTracks;
  page!: number;
  pageMax!: number;
  pageSize = 6;

  constructor(private trackService: TrackService, private pageService: PageService, private datePipe: DatePipe,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.list(1);
  }

  public list(page: number): void {
    if (page >= 1) {
      this.routeSub = this.route.params.subscribe(params => {
        this.id = params['id'];
        this.trackService.getListOfTracks(this.id, page, this.pageSize, this.dateFromValue, this.dateToValue).subscribe(value => {
          if (page <= value.pageMax) {
            this.listOfTracks = value;
            this.page = value.page;
            this.pageMax = value.pageMax;
            for (let track of this.listOfTracks.listOfTracks)
            {
              var coords = track.from.split(";");
              this.trackService.getReverseGeocoding(coords).subscribe(value => {
                track.from =  value.address;
              });
              coords = track.to.split(";");
              this.trackService.getReverseGeocoding(coords).subscribe(value => {
                track.to =  value.address;
              });
            }
          }
        });
      });
    }
  }

  showLocationOfPoints(joined: string):string {
    var coords = joined.split(";");
    this.trackService.getReverseGeocoding(coords).subscribe(value => {
      return value.address;
    });
    return 'gsd';
  }
}

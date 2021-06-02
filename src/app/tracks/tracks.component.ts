import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

interface LoginStatus {
  logged: boolean;
  rbac: string;
  nickname: string;
}

interface ListOfTrack {
  distance: number;
  start: number;
  from: string;
  end: number;
  id: number;
  to: string;
}

interface ListOfTracks {
  page: number;
  user: string;
  pageMax: number;
  listOfTracks: ListOfTrack[];
}

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {
  private routeSub: Subscription;
  private id:number;
  dateFromValue: string;
  dateToValue: string;
  listOfTracks: ListOfTracks;
  page: number;
  pageMax: number;
  pageSize = 6;

  constructor(private datePipe: DatePipe, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get<LoginStatus>('/API/authorization/status').subscribe(value => {
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
        this.http.get<ListOfTracks>('/API/track/list/' + this.id + '/' + page + '/' + this.pageSize + '/' + this.dateFromValue + '/' + this.dateToValue + '/').subscribe(value => {
          if (page <= value.pageMax) {
            this.listOfTracks = value;
            this.page = value.page;
            this.pageMax = value.pageMax;
          }
        });
      });
    }
  }

}

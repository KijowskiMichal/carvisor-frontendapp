import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SafetyService} from "../services/safety.service";
import {TrackService} from "../services/track.service";

@Component({
  selector: 'app-safety-chart',
  templateUrl: './safety-chart.component.html',
  styleUrls: ['./safety-chart.component.scss'],
  //encapsulation: ViewEncapsulation.ShadowDom
})
export class SafetyChartComponent implements OnInit {

  @Input() set popup(value: boolean) {
    this.popup_ = value;
  }
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  multiAxisData: any;
  multiAxisOptions: any;
  popup_ = false;

  constructor(private safetyService: SafetyService, private trackService: TrackService) { }

  ngOnInit(): void {
    this.safetyService.listSafetyPoints(1, 9999, '$').subscribe((value) => {
      let labels: string[] = [];
      let rate: number[] = [];
      let tracks: number[] = [];
      value.listOfUsers.forEach((row) => {
        labels.push(row.name+" "+row.surname);
        rate.push(row.rate);
        tracks.push(row.tracks);
      })
      this.multiAxisData = {
        labels: labels,
        datasets: [
          {
            label: 'Ocena',
            backgroundColor: '#FFD166',
            data: rate
          },
          {
            label: 'Liczba tras',
            backgroundColor: '#ef476f',
            data: tracks
          }
        ]
      };
      this.multiAxisOptions = {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          },
          tooltips: {
            mode: 'index',
            intersect: true
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              min: 0,
              max: 100,
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
              color: '#ebedef'
            },
            ticks: {
              min: 0,
              max: 100,
              color: '#495057'
            }
          }
        }
      };
    })
  }

  closeWindow() {
    this.popup_ = !(this.popup_);
    this.popupChange.emit(this.popup_);
  }

}

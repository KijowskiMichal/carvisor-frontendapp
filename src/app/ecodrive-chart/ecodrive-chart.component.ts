import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EcoService} from "../services/eco.service";

@Component({
  selector: 'app-ecodrive-chart',
  templateUrl: './ecodrive-chart.component.html',
  styleUrls: ['./ecodrive-chart.component.scss']
})
export class EcodriveChartComponent implements OnInit {

  @Input() regex;
  @Input() set popup(value: boolean) {
    this.popup_ = value;
    if (this.popup_ === true) {
      !this.regex ? this.regex = '$' : this.regex;
      this.ecoService.listEcoPoints(1, 9999, this.regex).subscribe((value) => {
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
  }
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  multiAxisData: any;
  multiAxisOptions: any;
  popup_ = false;

  constructor(private ecoService: EcoService) { }

  ngOnInit(): void {
  }

  closeWindow() {
    this.popup_ = !(this.popup_);
    this.popupChange.emit(this.popup_);
  }

}

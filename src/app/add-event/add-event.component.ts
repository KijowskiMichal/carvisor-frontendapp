import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {listNames, MapService} from "../services/map.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('popupTrigger') toggleButton!: ElementRef;

  constructor(public datePipe: DatePipe, private mapService: MapService, private renderer: Renderer2) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && this.popupOn){
        this.disablePopup();
      }
    });
  }

  popupOk = false;
  popupFail = false;
  popupOn = false;
  names!: listNames[];
  popupTrigger!: HTMLDivElement;
  dateFromValue!:string;
  dateToValue!:string;
  dateFromTimestamp!: number;
  dateToTimestamp!: number;
  deviceID = 0;

  ngAfterViewInit() {
    this.popupTrigger = this.toggleButton.nativeElement;
  }

  ngOnInit(): void {
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }

  showPopup() {
    this.popupOn = true;
    this.popupTrigger.classList.add("popupOpen");
  }

  disablePopup() {
    this.popupTrigger.classList.remove("popupOpen");
    this.popupOn = false;
  }

  chooseOption(value:number, text:string) {
    this.deviceID = value;
    this.popupTrigger.innerHTML = text;
  }

  showDevices() {
    this.mapService.getListOfDevice('$').subscribe(value => {
      this.names = value;
      this.showPopup();
    });
  }

}

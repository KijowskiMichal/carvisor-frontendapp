import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {CalendarService, EventDetail, ListNames} from "../services/calendar.service";

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  popup = false;
  @Input()
  set popupFlag(value) {
    if (value === true) {
      this.calendarService.getEvent(this.eventId).subscribe(value => {
        this.popup = true;
        this.eventInfo = value;
        this.dateFromValue = this.datePipe.transform(Number(this.eventInfo.start) * 1000, 'yyyy-MM-dd');
        this.dateToValue = this.datePipe.transform(Number(this.eventInfo.end) * 1000, 'yyyy-MM-dd');
        this.selected = this.names.filter((device) => device.id === value.device).pop();
        this.checkbox = this.eventInfo.remind;
        this.popupOn = false;
      });
    }
    else {
      this.popup = false;
    }
  }
  @Input() eventId = 0;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventEdit: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('popupTrigger') toggleButton!: ElementRef;

  constructor(public datePipe: DatePipe, private calendarService: CalendarService,
              private renderer: Renderer2) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && this.popupOn){
        this.disablePopup();
      }
    });
  }

  popupOk = false;
  popupFail = false;
  popupOn = false;
  names!: ListNames[];
  popupTrigger!: HTMLDivElement;
  dateFromValue!:string;
  dateToValue!:string;
  dateFromTimestamp!: number;
  dateToTimestamp!: number;
  checkbox!: boolean;
  deviceID = 0;
  selected: ListNames;
  eventInfo: EventDetail;

  ngAfterViewInit() {
    this.popupTrigger = this.toggleButton.nativeElement;
  }

  ngOnInit(): void {
    this.showDevices();
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

  chooseOption(value:number, text:string, image:string) {
    this.selected = {
      name: text,
      id: value,
      image: image,
    }
  }

  showDevices() {
    this.calendarService.getListOfDevice('$').subscribe(value => {
      this.names = value;
      this.showPopup();
    });
  }

  sendForm(name:HTMLInputElement, description:HTMLTextAreaElement, type:HTMLSelectElement, datefrom:HTMLInputElement,
           dateto:HTMLInputElement, device:HTMLDivElement) {
    this.dateFromTimestamp = new Date(this.dateFromValue).valueOf() / 1000;
    this.dateToTimestamp = (new Date(this.dateToValue).valueOf() / 1000) + 86399;
    let nameValue = name.value;
    let descriptionValue = description.value;
    let typeValue = type.value;
    let allClear = true;
    name.classList.remove('error');
    description.classList.remove('error');
    type.classList.remove('error');
    datefrom.classList.remove('error');
    dateto.classList.remove('error');
    device.classList.remove('error');
    //validator
    if (!/^.{3,60}$/.test(description.value)) {
      description.focus();
      description.classList.add('error');
      description.value = "";
      description.placeholder = "Od 3 do 60 znaków.";
      allClear = false;
    }
    if (!/^.{3,30}$/.test(name.value)) {
      name.focus();
      name.classList.add('error');
      name.value = "";
      name.placeholder = "Od 3 do 30 znaków.";
      allClear = false;
    }
    if (typeValue === "") {
      type.focus();
      type.classList.add('error');
      allClear = false;
    }
    if ((this.dateFromTimestamp > this.dateToTimestamp) || datefrom.value === '' || dateto.value === '') {
      datefrom.classList.add('error');
      dateto.classList.add('error');
      allClear = false;
    }
    if (!this.selected) {
      device.classList.add('error');
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.calendarService.putEvent(this.eventId, this.dateFromTimestamp, this.dateToTimestamp, nameValue, descriptionValue, typeValue,
      this.selected.id,true, this.checkbox).subscribe(
      () => {
      },
      () => {
        this.closeWindow();
        this.popupFail = true;
        this.checkbox = false;
      },
      () => {
        this.closeWindow();
        this.popupOk = true;
        this.checkbox = false;
        this.eventEdit.emit();
      });
    }

}

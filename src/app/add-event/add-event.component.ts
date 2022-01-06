import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DatePipe} from "@angular/common";
import {CalendarService, ListNames} from "../services/calendar.service";

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, AfterViewInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() eventAdd: EventEmitter<void> = new EventEmitter<void>();
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
  checkbox = false;
  deviceID = 0;
  selected: ListNames;

  eventName!: string;
  eventDesc!: string;
  eventType = "";

  ngAfterViewInit() {
    this.popupTrigger = this.toggleButton.nativeElement;
  }

  ngOnInit(): void {
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.showDevices();
  }

  closeWindow() {
    this.eventName = null;
    this.eventDesc = null;
    this.eventType = "";
    this.dateFromValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.dateToValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.deviceID = 0;
    this.selected = null;
    this.checkbox = false;
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
    this.calendarService.addEvent(this.dateFromTimestamp, this.dateToTimestamp, nameValue, descriptionValue, typeValue,
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
        this.eventAdd.emit();
      });

  }

}

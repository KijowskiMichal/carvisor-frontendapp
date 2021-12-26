import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {CalendarService, EventDetail} from "../services/calendar.service";

const colors: any = {
  red: {
    primary: '#ef476f',
    secondary: '#f58294',
  },
  blue: {
    primary: '#118AB2',
    secondary: '#63adc4',
  },
  yellow: {
    primary: '#FFD166',
    secondary: '#fdeab3',
  },
  green: {
    primary: '#06D6A0',
    secondary: '#94e3c6',
  },
  purple: {
    primary: '#c266ff',
    secondary: '#e2b3fd',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
        this.editEventPopup = true;
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
        this.deleteEvent(Number(event.id));
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  eventsOrigin: EventDetail[] = [];
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;
  addEventPopup: boolean;
  editEventPopup: boolean;

  constructor(private modal: NgbModal, private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.updateEvent();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.updateEvent();
    this.refresh.next();
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(id: number) {
    this.calendarService.deleteEvent(id).subscribe();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  updateEvent() {
    this.calendarService.getEvents(this.viewDate.getMonth() + 1, this.viewDate.getFullYear()).subscribe((events) => {
      this.eventsOrigin = events;
      this.events = events.map((event) => {
        return {
          id: event.id,
          color: colors[event.color],
          start: new Date(event.end as number * 1000),
          end: new Date(event.end as number * 1000),
          title: event.title+" - "+event.description,
          actions: this.actions,
          draggable: event.draggable,
        }
      }) as unknown as CalendarEvent[];
    })
  }

  updateTime() {
    this.updateEvent();
  }

}

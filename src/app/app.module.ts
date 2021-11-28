import {LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { LeftpanelComponent } from './leftpanel/leftpanel.component';

import { HttpClientModule } from "@angular/common/http";
import { EditUserComponent } from './edit-user/edit-user.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { EditVehicleComponent } from './edit-vehicle/edit-vehicle.component';
import { SettingsComponent } from './settings/settings.component';
import { MapComponent } from './map/map.component';
import {FormsModule} from "@angular/forms";
import {CommonModule, DatePipe} from "@angular/common";
import { TracksComponent } from './tracks/tracks.component';
import { EcodriveComponent } from './ecodrive/ecodrive.component';
import { MapDevicesComponent } from './map-devices/map-devices.component';
import { SafetyComponent } from './safety/safety.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EcodriveUserComponent } from './ecodrive-user/ecodrive-user.component';
import { SortEcoPointsPipe } from './pipes/sort-eco-points.pipe';
import { SortSafetyPointsPipe } from './pipes/sort-safety-points.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { SafetyUserComponent } from './safety-user/safety-user.component';
import { WarningsComponent } from './warnings/warnings.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReportsComponent } from './reports/reports.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import '@angular/common/locales/global/pl';
import { AddEventComponent } from './add-event/add-event.component';
import { AddReportComponent } from './add-report/add-report.component';
import { AddZoneComponent } from './add-zone/add-zone.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    LeftpanelComponent,
    EditUserComponent,
    VehiclesComponent,
    EditVehicleComponent,
    SettingsComponent,
    MapComponent,
    TracksComponent,
    EcodriveComponent,
    MapDevicesComponent,
    SafetyComponent,
    AddUserComponent,
    EcodriveUserComponent,
    SortEcoPointsPipe,
    SortSafetyPointsPipe,
    NotificationsComponent,
    SafetyUserComponent,
    WarningsComponent,
    CalendarComponent,
    ReportsComponent,
    AddEventComponent,
    AddReportComponent,
    AddZoneComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [DatePipe, {provide: LOCALE_ID, useValue: 'pl-PL'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

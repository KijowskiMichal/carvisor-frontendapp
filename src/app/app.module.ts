import { NgModule } from '@angular/core';
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
import {DatePipe} from "@angular/common";
import { TracksComponent } from './tracks/tracks.component';
import { EcodriveComponent } from './ecodrive/ecodrive.component';
import { MapDevicesComponent } from './map-devices/map-devices.component';
import { SafetyComponent } from './safety/safety.component';
import { AddUserComponent } from './add-user/add-user.component';

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
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

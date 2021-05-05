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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    LeftpanelComponent,
    EditUserComponent,
    VehiclesComponent,
    EditVehicleComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { VehiclesComponent } from "./vehicles/vehicles.component";
import { EditVehicleComponent } from "./edit-vehicle/edit-vehicle.component";
import { SettingsComponent } from "./settings/settings.component";
import { MapComponent } from "./map/map.component";
import { EcodriveComponent } from "./ecodrive/ecodrive.component";
import { TracksComponent } from "./tracks/tracks.component";
import { MapDevicesComponent } from "./map-devices/map-devices.component";
import { SafetyComponent } from "./safety/safety.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { WarningsComponent } from "./warnings/warnings.component";

const routes: Routes = [  { path: '', component: LoginComponent},
                          { path: 'users', component: UsersComponent},
                          { path: 'editUser/:id', component: EditUserComponent},
                          { path: 'vehicles', component: VehiclesComponent},
                          { path: 'editVehicle/:id', component: EditVehicleComponent},
                          { path: 'settings', component: SettingsComponent},
                          { path: 'map/devices', component: MapDevicesComponent},
                          { path: 'map/devices/:id/:date', component: MapDevicesComponent},
                          { path: 'map', component: MapComponent},
                          { path: 'map/:id/:date', component: MapComponent},
                          { path: 'ecodrive', component: EcodriveComponent},
                          { path: 'tracks/:id', component: TracksComponent},
                          { path: 'safety', component: SafetyComponent},
                          { path: 'notifications', component: NotificationsComponent},
                          { path: 'warnings', component: WarningsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

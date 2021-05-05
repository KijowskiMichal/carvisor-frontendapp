import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { VehiclesComponent } from "./vehicles/vehicles.component";
import { EditVehicleComponent } from "./edit-vehicle/edit-vehicle.component";
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [  { path: '', component: LoginComponent},
                          { path: 'users', component: UsersComponent},
                          { path: 'editUser', component: EditUserComponent},
                          { path: 'vehicles', component: VehiclesComponent},
                          { path: 'editVehicle', component: EditVehicleComponent},
                          { path: 'settings', component: SettingsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

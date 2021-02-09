import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StationsListComponent } from './stations-list/stations-list.component';
import { LoginComponent } from './login/login.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DeviceViewComponent } from './devices-list/device-view/device-view.component';
import { MaterialsComponent } from './materials/materials.component';
import { WarningSafetyComponent } from './warning-safety/warning-safety.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stations', component: StationsListComponent, data: { breadcrumb: 'Stations' } },
  { path: 'stations/:name', component: DevicesListComponent, data: { breadcrumb: 'Stations' }  },
  { path: 'stations/:sname/:dname', component: DeviceViewComponent, data: { breadcrumb: 'Stations' }  },
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
  { path: 'materials', component: MaterialsComponent, data: { breadcrumb: 'Materials' } },
  { path: 'safety', component: WarningSafetyComponent, data: { breadcrumb: 'Safety' } },
  { path: 'safety/:name', component: WarningSafetyComponent, data: { breadcrumb: 'Safety' } },
  { path: '', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

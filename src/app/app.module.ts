import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DeviceViewComponent } from './devices-list/device-view/device-view.component';
import { DeviceComponent } from './devices-list/device/device.component';
import { StationComponent } from './stations-list/station/station.component';
import { StationsListComponent } from './stations-list/stations-list.component';
import { LoginComponent } from './login/login.component';
import { MaterialsComponent } from './materials/materials.component';
import { WarningSafetyComponent } from './warning-safety/warning-safety.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthGuard } from './auth/auth.guard';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { Ng8BreadcrumbModule } from 'ng8-breadcrumb';
import { PopoverModule } from 'ngx-smart-popover';
import { CrystalLightboxModule } from '@crystalui/angular-lightbox';
import { SafePipe } from './shared/pipe.model';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    StationComponent,
    StationsListComponent,
    LoginComponent,
    DevicesListComponent,
    DeviceViewComponent,
    DeviceComponent,
    MaterialsComponent,
    WarningSafetyComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPageScrollModule,
    NgxPageScrollCoreModule,
    Ng8BreadcrumbModule.forRoot({
      prefix: 'Home' // default 'false'
    }),
    PopoverModule,
    CrystalLightboxModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [AuthGuard, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {}

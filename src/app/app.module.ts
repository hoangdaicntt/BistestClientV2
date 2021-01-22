import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DeviceLogComponent } from './components/device-log/device-log.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { DeviceUnmixComponent } from './components/device-unmix/device-unmix.component';
import { NullPipe } from './pipes/null.pipe';
import { DeviceMixedComponent } from './components/device-mixed/device-mixed.component';
import { DeviceSmoothComponent } from './components/device-smooth/device-smooth.component';
import { AuthComponent } from './components/auth/auth.component';
import { ErrorLogComponent } from './components/error-log/error-log.component';

@NgModule({
  declarations: [
    AppComponent,
    DeviceLogComponent,
    DeviceUnmixComponent,
    NullPipe,
    DeviceMixedComponent,
    DeviceSmoothComponent,
    AuthComponent,
    ErrorLogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

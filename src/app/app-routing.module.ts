import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DeviceLogComponent} from './components/device-log/device-log.component';
import {DeviceUnmixComponent} from './components/device-unmix/device-unmix.component';
import {DeviceMixedComponent} from './components/device-mixed/device-mixed.component';
import {DeviceSmoothComponent} from './components/device-smooth/device-smooth.component';
import {AuthGuard} from './guard/auth.guard';
import {AuthComponent} from './components/auth/auth.component';

const routes: Routes = [
  {path: 'login', component: AuthComponent},
  {path: 'device-log', component: DeviceLogComponent, canActivate: [AuthGuard]},
  {path: '', component: DeviceLogComponent, canActivate: [AuthGuard]},
  {path: 'device-unmix', component: DeviceUnmixComponent, canActivate: [AuthGuard]},
  {path: 'device-mixed', component: DeviceMixedComponent, canActivate: [AuthGuard]},
  {path: 'device-smooth', component: DeviceSmoothComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

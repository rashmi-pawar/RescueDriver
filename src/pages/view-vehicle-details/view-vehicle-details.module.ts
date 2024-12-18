import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewVehicleDetailsPage } from './view-vehicle-details';

@NgModule({
  declarations: [
    ViewVehicleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewVehicleDetailsPage),
  ],
})
export class ViewVehicleDetailsPageModule {}

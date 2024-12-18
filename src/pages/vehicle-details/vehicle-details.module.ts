import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehicleDetailsPage } from './vehicle-details';

@NgModule({
  declarations: [
    VehicleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(VehicleDetailsPage),
  ],
})
export class VehicleDetailsPageModule {}

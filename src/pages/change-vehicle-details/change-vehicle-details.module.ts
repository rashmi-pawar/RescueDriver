import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeVehicleDetailsPage } from './change-vehicle-details';

@NgModule({
  declarations: [
    ChangeVehicleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeVehicleDetailsPage),
  ],
})
export class ChangeVehicleDetailsPageModule {}

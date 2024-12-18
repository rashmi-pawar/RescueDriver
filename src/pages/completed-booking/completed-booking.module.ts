import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletedBookingPage } from './completed-booking';

@NgModule({
  declarations: [
    CompletedBookingPage,
  ],
  imports: [
    IonicPageModule.forChild(CompletedBookingPage),
  ],
})
export class CompletedBookingPageModule {}

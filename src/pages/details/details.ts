import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {Storage} from "@ionic/storage";
import {App} from "ionic-angular/index";
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  detailData : any = {};
  curDate: any;
  tabFar: any;

  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public app : App,
              public storage:Storage,
              public navParams: NavParams) {
    this.detailData = navParams.data.detail;
  }

  ionViewDidLoad() {

  }
  accept(){
    this.curDate = moment().format("YYYY-MM-DD");
    this.tabFar = this.detailData.pick_date;
    if (this.tabFar == this.curDate) {
    localStorage.setItem('isArrived','false');
    this.storage.get('userData').then(userData=>{
      let user : any = JSON.parse(userData);
      let data = {
        "user_id":user.id,
        "booking_id":this.detailData.id,
        "status": "2"
      }
      this.util.presentLoader();
      this.user.acceptBooking(data).subscribe(res=>{
        let resp : any = res;
        if (resp.status){
          this.createRoom();
          this.util.presentAlert('',resp.message);
          // this.navCtrl.setRoot('TabsPage');
          let data = {
            "driver_id":user.id,
            "booking_id":this.detailData.id,
            "latitude":"",
            "longitude":"",
            "trip_status":"1"
          }
          this.user.tripStartEnd(data).subscribe(res=>{
            let resp : any =res;
            if (resp.status){
              this.storage.set('startedTripData',resp.data).then(()=>{
                this.navCtrl.setRoot('TrackLocationPage');
              })
            }else {
              this.util.presentToast(resp.message);
            }
            setTimeout(()=>{
              this.util.dismissLoader();
            },500)
          },error => {
            console.error(error);
            this.util.dismissLoader();
          })
        }
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    })
  }else{
    this.util.presentAlert('Notification', 'Proceed on booking date');
  }
  }

  createRoom() {

  }
}

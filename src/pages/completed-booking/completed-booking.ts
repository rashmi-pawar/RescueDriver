import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from "ionic-angular/index";
import { UtilProvider } from "../../providers/util/util";
import { User } from "../../providers";
import { Storage } from "@ionic/storage";
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-completed-booking',
  templateUrl: 'completed-booking.html',
})
export class CompletedBookingPage {

  historyList: any = [];
  isListEmpty: boolean = false;
  thisMonth: any;
  firstDay: any;
  lastDay: any;
  pet: string = 'kittens';
  firstDayMonth:any;
  lastDayMonth:any;
  todayDate: any = moment().format('YYYY-MM-DD');
  constructor(public navCtrl: NavController,
    public util: UtilProvider,
    public user: User,
    public storage: Storage,
    public app: App,
    public navParams: NavParams) {
    const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    this.thisMonth = monthNames[(new Date()).getMonth()];
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));
    this.firstDay = moment(firstday).format('YYYY-MM-DD');
    this.lastDay = moment(lastday).format('YYYY-MM-DD');
    var date = new Date();
    var firstDayMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.firstDayMonth = moment(firstDayMonth).format('YYYY-MM-DD');
    this.lastDayMonth = moment(lastDayMonth).format('YYYY-MM-DD');
  }

  ionViewDidEnter() {
    this.getHistoryList();
  }
  getHistoryList() {
    this.storage.get('userData').then(userData => {
      let user: any = JSON.parse(userData);
      this.util.presentLoader();
      let data = {
        "user_id": user.id,
        "status": "2"
      }
      this.user.getHistory(data).subscribe(res => {
        let resp: any = res;
        console.log('resp', resp)
        if (resp.status) {
          this.historyList = resp.data.history_data;
        }
        this.historyList && this.historyList.length > 0 ? this.isListEmpty = false : this.isListEmpty = true;
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500)
      }, error => {
        console.error(error);
        this.util.dismissLoader();
        this.historyList && this.historyList.length > 0 ? this.isListEmpty = false : this.isListEmpty = true;
      })
    })
  }

  notificaion() {
    this.app.getRootNav().push('NotificationsPage');
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { User } from "../../providers";
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation";
import { Events } from "ionic-angular/index";
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  bookingList: any = [];
  userData: any = {}
  isListEmpty: boolean = false;
  interval: any = '';

  watch: any = '';
  subscription: any = '';
  pepperoni: any;
  onlineoffline: string;
  myinterval: any;
  timer: number;
  timerReject: number;
  maxTime: number = 30;
  maxTimeReject: number = 60;
  hidevalue: boolean;
  hidevalueReject: boolean;
  audio: any;
  localAllRequest: string;
  driverinterval: any;
  pet: string = 'kittens';
  curDate = moment().format("YYYY-MM-DD");
  getMinutes: number;
  getSeconds: number;
  constructor(public navCtrl: NavController,
    public user: User,
    public geolocation: Geolocation,
    public storage: Storage,
    public events: Events,
    public util: UtilProvider,
    public platform: Platform,
    public navParams: NavParams) {
    localStorage.setItem('allRequest', '100');
    this.storage.get('setRemainingTime').then(setRemainingTime => {
      if (setRemainingTime > 0) {
        this.maxTimeReject = setRemainingTime;
        this.storage.get('requestIdNew').then(requestIdNew => {
          this.StartTimerForReject(requestIdNew);
        })
      }
    })
    this.storage.get('userData').then(userData => {
      this.userData = JSON.parse(userData);
      this.getAllRequestGet(false);
    })
    this.platform.pause.subscribe((err) => {
      this.audio.pause();
      console.log('pause');
    });
    //Subscribe on resume i.e. foreground 
    this.platform.resume.subscribe((error) => {
      // window['paused'] = 0;
      if (this.hidevalue == true) {
        this.audio.pause();
        console.log('pause true');
      }
      if (this.hidevalue == false) {
        this.audio.play();
        this.audio.loop = true;
        console.log('play');
      }
    });
    // events.subscribe('bookingRequest', () => {
    //   this.StartTimer();
    //   this.getAllRequest(false);
    // })
    this.myinterval = setInterval(() => {
      this.storage.get('userData').then(userData => {
        this.userData = JSON.parse(userData);
      })
      this.getAllRequest(true);
    }, 5000)
    // this.StartTimerForReject();

  }

  ionViewDidLoad() {
    this.audio = new Audio();
    this.audio.src = '../../assets/tune/tune.mp3';
    this.audio.load();
    this.storage.get('userData').then(userData => {
      this.userData = JSON.parse(userData);
      if (this.userData.username == '') {
        this.navCtrl.push('EditProfilePage');
      } else { }
      if (this.userData.login_status == 'Online') {
        this.pepperoni = true;
      } else {
        this.pepperoni = false;
      }
      this.getAllRequest(false);
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.driverinterval = setInterval(() => {
        this.updateCurrentLocation();
      }, 8000);
      // this.getCurrentLocation();
    })
  }
  /*getCurrentLocation() {
    console.log('getCurrentLocation called');
    this.watch = this.geolocation.watchPosition({enableHighAccuracy: true});
    this.subscription = this.watch.subscribe((data) => {
      console.log('watch geolocation data >>>',data);
    });
  }*/
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }

  chat_list() {
    this.navCtrl.push("ChatListPage");
  }
  view(item) {
    this.stopAudio();
    this.hidevalue == true;
    this.maxTime = 0;
    this.hidevalueReject = true;
    if (this.timerReject) {
      clearInterval(this.timerReject);
    }
    this.navCtrl.push("DetailsPage", { detail: item });
  }
  openNotif() {
    this.navCtrl.push("NotificationsPage");
  }

  getAllRequest(isRefresh) {
    this.localAllRequest = localStorage.getItem('allRequest');
    // this.util.presentLoader();
    let data = {
      "user_id": this.userData.id
    }
    this.user.getAllBookings(data).subscribe(res => {
      let resp: any = res;
      // console.log(resp.data);
      if (resp.status) {
        this.bookingList = resp.data;
        if (this.localAllRequest < resp.data.length) {
          this.StartTimer();
          this.StartTimerForReject(resp.data[0].id);
          this.maxTimeReject = 60;
          this.util.presentAlert("Notification", "Vehicle Service Request");
          this.getAllRequestGet(true);
        }
      }
      localStorage.setItem('allRequest', resp.data.length);
    }, error => {
      console.error(error);
    })
  }
  getAllRequestGet(isRefresh) {
    this.util.presentLoader();
    this.storage.get('userData').then(userData => {
      this.userData = JSON.parse(userData);
      let data = {
        "user_id": this.userData.id
      }
      // console.log('data>>>>',data);
      this.user.getAllBookings(data).subscribe(res => {
        let resp: any = res;
        console.log(res);
        if (resp.status) {
          this.bookingList = resp.data;
        } else {
          if (isRefresh) {
            this.bookingList = [];
          }
        }
        this.bookingList.length && this.bookingList.length > 0 ? this.isListEmpty = false : this.isListEmpty = true;
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500)
      }, error => {
        console.error(error);
        this.bookingList.length && this.bookingList.length > 0 ? this.isListEmpty = false : this.isListEmpty = true;
        this.util.dismissLoader();
      })
    })
  }

  updateCurrentLocation() {
    // console.log('updateCurrentLocation called !!!!');
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      // console.log('lat', resp.coords.latitude, 'lng', resp.coords.longitude);
      let rawData = {
        "user_id": this.userData.id,
        "latitude": resp.coords.latitude,
        "longitude": resp.coords.longitude,
        "user_type": "2"
      }
      this.user.updateLatLng(rawData).subscribe(res => {
        // console.log(res);
      }, error => {
        console.log(error);
      })
    });
  }

  reject(item: any) {
    this.stopAudio();
    this.hidevalue == true;
    this.maxTime = 0;
    this.hidevalueReject == true;
    this.maxTimeReject = 0;
    let data = {
      "user_id": this.userData.id,
      "booking_id": item,
      "status": "3"
    }
    console.log(data);
    this.util.presentLoader();
    this.user.acceptBooking(data).subscribe(res => {
      let resp: any = res;
      // console.log('resp',resp);
      if (resp.status) {
        // this.getAllRequestGet(true);
        this.bookingList = [];
        this.storage.get('userData').then(userData => {
          this.userData = JSON.parse(userData);
          this.getAllRequestGet(false);
        })
        this.storage.set('requestIdNew', null).then(() => {
        });
        this.util.presentToast(resp.message);
        setTimeout(() => {
          this.getAllRequest(true);
        }, 1000);
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500)
    }, error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }
  goOnline() {
    console.log(this.pepperoni);
    // onlineOffline
    if (this.pepperoni == true) {
      this.onlineoffline = 'Online';
    } else {
      this.onlineoffline = 'Offline';
    }
    let data = {
      "user_id": this.userData.id,
      "login_status": this.onlineoffline,
    }
    this.util.presentLoader();
    this.user.onlineOffline(data).subscribe(res => {
      let resp: any = res;
      this.storage.set('userData', JSON.stringify(resp.data)).then(() => {
        // this.navCtrl.setRoot('MenuPage');
      });

      // console.log(resp);
      // console.log(data);
      if (resp.status) {
        this.util.presentToast(resp.message);
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500)
    }, error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }
  playAudio() {
    this.audio.play();
    this.audio.loop = true;
  }

  stopAudio() {
    this.audio.pause();
    console.log('pause')
  }
  StartTimer() {
    // console.log('hit booking request new');
    this.timer = setTimeout(x => {
      if (this.maxTime <= 0) { }
      this.maxTime -= 1;

      if (this.maxTime > 0) {
        this.hidevalue = false;
        console.log('this.maxTime', this.maxTime);
        this.StartTimer();
        this.playAudio();
        // this.display(this.maxTime);
      }

      else {
        this.hidevalue = true;
        console.log('not play');
        this.stopAudio();
      }

    }, 1000);
  }
  StartTimerForReject(id) {
    console.log('hit booking request new', id);
    this.timerReject = setTimeout(x => {
      if (this.maxTimeReject <= 0) { }
      this.maxTimeReject -= 1;

      if (this.maxTimeReject > 0) {
        this.hidevalueReject = false;
        let hours = Math.floor(this.maxTimeReject / 3600); // get hours
        this.getMinutes = Math.floor((this.maxTimeReject - (hours * 3600)) / 60); // get minutes
        this.getSeconds = this.maxTimeReject - (hours * 3600) - (this.getMinutes * 60); //  get seconds
        this.storage.set('setRemainingTime', this.maxTimeReject).then(() => {
        });
        this.storage.set('requestIdNew', id).then(() => {
        });
        this.StartTimerForReject(id);
      }

      else {
        this.hidevalueReject = true;
        this.reject(id)
        // this.maxTimeReject = 60;
        this.storage.set('setRemainingTime', 0).then(() => {
        });
      }

    }, 1000);
  }
}


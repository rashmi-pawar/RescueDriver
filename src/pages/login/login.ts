import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from '../../providers';
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";
import { Events, Platform } from "ionic-angular/index";
import { FCM } from "@ionic-native/fcm";
import "rxjs/add/operator/map";



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginForm: FormGroup;
  error_messages: any = {};
  firebaseToken: any = '';
  withnumber: any;
  codemapdata: any;

  constructor(public navCtrl: NavController,
    public util: UtilProvider,
    public user: User,
    public fcm: FCM,
    public events: Events,
    public platform: Platform,
    public storage: Storage,
    public formBuilder: FormBuilder, public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupLoginFormData();
    this.getLocalData();
  }

  setupLoginFormData() {
    this.error_messages = {
      email: [
        { type: "required", message: "Mobile Number is required" },
        { type: "pattern", message: 'Please enter valid number' },
        { type: "minlength", message: '*Minimum length should be 10' },
        { type: "maxlength", message: '*Maximum length should be 10' }
      ],

      password: [
        { type: "required", message: 'Password is required' },
      ],

      otp: [
        { type: "required", message: "Otp is required" },
        { type: "pattern", message: 'Please enter valid otp' }
      ]
    };
    this.loginForm = this.formBuilder.group(
      {
        email: new FormControl(

          "", Validators.compose([Validators.required,
          Validators.pattern('^([0|\\+[0-9]{1,5})?([6-9][0-9]{9})$'),
          Validators.minLength(10),
          // Validators.maxLength(10)
          ])
        ),
        otp: new FormControl(

          "", Validators.compose([Validators.required,
          Validators.pattern('(\\d{4})'),
          Validators.minLength(4),
          Validators.maxLength(4)
          ])
        ),
        dialcodecountry: new FormControl("+44"),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required
          ])
        )
      },
    );
  }

  ionViewDidLoad() {
  }

  signUp() {
    this.navCtrl.push('SignUpPage');
  }
  Forgot_pass() {
    this.navCtrl.push('ForgotPasswordPage');
  }


  doLogin() {
    this.util.presentLoader('');
    let formData = new FormData();
    formData.append('mobile', this.loginForm.value.email);
    // formData.append('password',this.loginForm.value.password);
    formData.append('login_type', '2');
    formData.append('fcm_token', this.firebaseToken);

    this.user.login(formData).subscribe(res => {
      let resp: any = res;
      this.util.presentToast(resp.message);
      if (resp.status) {
        // this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
        //   this.navCtrl.setRoot('MenuPage')
        // });
        if (resp.data.is_driver_document == '1') {
          this.storage.set('userData', JSON.stringify(resp.data)).then(() => {
            this.navCtrl.setRoot('MenuPage')
          });
        } else {
          let requestData: any = {
            fullName: '',
            email: '',
            address: '',
            mobileNumber: this.withnumber,
            password: '',
            fcm_token: this.firebaseToken
          }
          console.log("requestData", requestData);
          this.navCtrl.push('VehicleDetailsPage', { requestData: requestData });
        }
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500);
    }, error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }
  getFirebaseToken() {
    // this.fcm.requestPushPermission().then(succ=>{
    //   console.log('login page permission asked >> response >>>',succ);
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('login page token >>>', this.firebaseToken);
    });

    /*this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
      console.log("check type >>>>",data.types);
      if (data.types === '1'){
        this.util.presentAlert('Booking',data.body);
        this.events.publish('bookingRequest',true);
      }
    });*/
    // });
  }

  sendOtp() {
    if (this.loginForm.value.email == '') {
      this.util.presentToast('Enter Mobile Number');
    } else {
      var removeStart = this.loginForm.value.email.replace(/^0+/, '');
      let str = this.loginForm.value.dialcodecountry;
      let mstr = str.substring(1);
      this.withnumber = mstr + removeStart;
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('mobile', this.withnumber);
      formData.append('login_type', '2');
      formData.append('fcm_token', this.firebaseToken);

      this.user.login(formData).subscribe(res => {
        let resp: any = res;
        this.util.presentToast(resp.message);
        if (resp.status) {
          console.log(resp);
        }
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500);
      }, error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }
  }
  verifyOtp() {
    if (this.loginForm.value.email == '') {
      this.util.presentToast('Enter mobile number');
    }
    else if (this.loginForm.value.otp == '') {
      this.util.presentToast('Enter otp first');
    } else {
      let str = this.loginForm.value.dialcodecountry;
      let mstr = str.substring(1);
      var removeStart = this.loginForm.value.email.replace(/^0+/, '');
      this.withnumber = mstr + removeStart;
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('mobile', this.withnumber);
      formData.append('user_type', '2');
      formData.append('otp', this.loginForm.value.otp);

      this.user.verifyOtp(formData).subscribe(res => {
        let resp: any = res;
        console.log(resp);
        this.util.presentToast(resp.message);
        if (resp.status) {
          console.log(resp);
          this.storage.set('userData', JSON.stringify(resp.data)).then(() => {
            this.navCtrl.setRoot('MenuPage')
          });
        }
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500);
      }, error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }
  }
  resendOtp() {
    if (this.loginForm.value.email == '') {
      this.util.presentToast('Enter mobile first');
    } else {
      let str = this.loginForm.value.dialcodecountry;
      let mstr = str.substring(1);
      var removeStart = this.loginForm.value.email.replace(/^0+/, '');
      this.withnumber = mstr + removeStart;
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('mobile', this.withnumber);
      formData.append('user_type', '2');
      // formData.append('otp',this.loginForm.value.otp);

      this.user.generateOtp(formData).subscribe(res => {
        let resp: any = res;
        console.log(resp);
        this.util.presentToast(resp.message);
        if (resp.status) {
          console.log(resp);
        }
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500);
      }, error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }
  }
  getLocalData() {
    fetch('./assets/data/country_code_flag.json').then(res => res.json())
      .then(json => {
        this.codemapdata = json;
        // console.log(json);
      });
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UtilProvider } from "../../providers/util/util";
import { User } from "../../providers";
import { Storage } from "@ionic/storage";
import { Events, Platform } from "ionic-angular/index";

import { FCM } from "@ionic-native/fcm";

@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  signUpForm: FormGroup;
  error_messages: any = {};
  firebaseToken: any = '';
  show: boolean = false;
  withnumber: any;
  codemapdata: any;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public util: UtilProvider,
    public user: User,
    public fcm: FCM,
    public events: Events,
    public storage: Storage,
    public platform: Platform,
    public navParams: NavParams) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.getFirebaseToken();
      }
    });
    this.setupSignUpForm();
    this.getLocalData();
  }

  signUp() {
    // let requestData :any = {
    //   fullName:this.signUpForm.value.fullName,
    //   email:this.signUpForm.value.email,
    //   address:this.signUpForm.value.address,
    //   mobileNumber:this.signUpForm.value.mobileNumber,
    //   // password:this.signUpForm.value.password,
    //   password:'12345678',
    //   fcm_token:this.firebaseToken
    // }
    let requestData: any = {
      fullName: 'Rashmi',
      email: 'rashmipawar12@gmail.com',
      address: 'betul',
      mobileNumber: this.signUpForm.value.mobileNumber,
      // password:this.signUpForm.value.password,
      password: '12345678',
      fcm_token: this.firebaseToken
    }
    console.log("requestData", requestData);
    this.navCtrl.push('VehicleDetailsPage', { requestData: requestData });
  }

  ionViewDidLoad() {
  }

  setupSignUpForm() {
    this.error_messages = {
      fullName: [
        { type: "required", message: 'FullName is required' },
      ],
      address: [
        { type: "required", message: 'Address is required' },
      ],
      mobileNumber: [
        { type: "required", message: 'Mobile number is required' },
        { type: "pattern", message: 'Please enter valid number' },
        { type: "minlength", message: '*Minimum length should be 10' },
        { type: "maxlength", message: '*Maximum length should be 10' }
      ],
      email: [
        { type: "required", message: 'Email is required' },
        { type: "pattern", message: '*Enter valid email' },
      ],
      password: [
        { type: "required", message: 'Password is required' },
        { type: "minlength", message: '*Minimum length should be 8' },
      ],

      otp: [
        { type: "required", message: "Otp is required" },
        { type: "pattern", message: 'Please enter valid otp' }
      ]
    };
    this.signUpForm = this.formBuilder.group(
      {
        fullName: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        address: new FormControl(
          "",
          Validators.compose([
            Validators.required,
          ])
        ),
        email: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
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
        mobileNumber: new FormControl(
          "", Validators.compose([Validators.required,
            Validators.pattern('^([0|\\+[0-9]{1,5})?([6-9][0-9]{9})$'),
          Validators.minLength(10),
          // Validators.maxLength(10)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
          ])
        )
      },
    );
  }

  getFirebaseToken() {
    this.fcm.getToken().then(token => {
      this.firebaseToken = token;
      console.log('token >>>', this.firebaseToken);
    });

    /*this.fcm.onNotification().subscribe(data => {
      if(data.wasTapped){
        console.log("Received in background",data);
      } else {
        console.log("Received in foreground",data);
      }
      if (data.types === '1'){
        this.util.presentAlert('Booking',data.body);
        this.events.publish('bookingRequest',true);
      }

    });*/
  }

  back() {
    this.navCtrl.pop();
  }
  sendOtp() {
    if (this.signUpForm.value.mobileNumber == '') {
      this.util.presentToast('Enter Mobile Number');
    } else {
      let str = this.signUpForm.value.dialcodecountry;
      let mstr = str.substring(1);
      var removeStart = this.signUpForm.value.mobileNumber.replace(/^0+/, '');
      this.withnumber = mstr + removeStart;
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('mobile', this.withnumber);
      formData.append('login_type', '2');
      formData.append('fcm_token', this.firebaseToken);

      this.user.login(formData).subscribe(res => {
        let resp: any = res;
        console.log(resp);
        this.util.presentToast(resp.message);
        if (resp.status) {
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
    if (this.signUpForm.value.mobileNumber == '') {
      this.util.presentToast('Enter mobile number');
    }
    else if (this.signUpForm.value.otp == '') {
      this.util.presentToast('Enter otp first');
    } else {
      let str = this.signUpForm.value.dialcodecountry;
      let mstr = str.substring(1);
      var removeStart = this.signUpForm.value.mobileNumber.replace(/^0+/, '');
      this.withnumber = mstr + removeStart;
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('mobile', this.withnumber);
      formData.append('user_type', '2');
      formData.append('otp', this.signUpForm.value.otp);

      this.user.verifyOtp(formData).subscribe(res => {
        let resp: any = res;
        console.log(resp);
        this.util.presentToast(resp.message);
        if (resp.status) {
          console.log(resp);
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
            this.navCtrl.push('VehicleDetailsPage', { requestData: requestData, userData: resp.data });
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
  }
  getLocalData() {
    fetch('./assets/data/country_code_flag.json').then(res => res.json())
      .then(json => {
        this.codemapdata = json;
        // console.log(json);
      });
  }
}

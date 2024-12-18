import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../providers";
import { UtilProvider } from "../../providers/util/util";
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-vehicle-details',
  templateUrl: 'vehicle-details.html',
})
export class VehicleDetailsPage {

  requestData: any = {
    fullName: '',
    email: '',
    address: '',
    mobileNumber: '',
    password: '',
    fcm_token: ''
  }
  vehicleRegistraion: any = '';
  drivingLicence: any = '';
  insuranceDoc: any = '';
  backgroundCheck: any = '';
  vehicleProfile: any = '';
  vehicleNumber: any = '';
  vehicleType: any = '';
  userData: any = {};
  payload: any = '';
  passengers: any = '';
  towType: any;
  constructor(public navCtrl: NavController,
    public util: UtilProvider,
    public user: User,
    public storage: Storage,
    public navParams: NavParams) {
    this.requestData = navParams.data.requestData;
    this.userData = navParams.data.userData;
    console.log(this.userData)
  }

  ionViewDidLoad() {
    this.getType();
  }
  getType() {
    this.user.getVehicleType().subscribe(res => {
      let resp: any = res;
      console.log('getVehicleType', resp);
      if (resp.status) {
        this.towType = resp.data;
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500);
    }, error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  save() {
    if (this.validate()) {
      this.util.presentLoader('');
      let formData = new FormData();
      formData.append('full_name', this.requestData.fullName);
      formData.append('mobile', this.requestData.mobileNumber);
      formData.append('bio', '');
      formData.append('user_image', '');
      formData.append('profile_id', this.userData.id);
      formData.append('vehicle_registration', this.vehicleRegistraion);
      formData.append('driving_licence', this.drivingLicence);
      formData.append('insurance_doc', this.insuranceDoc);
      formData.append('vehicle_image', this.vehicleProfile);
      formData.append('background_check', this.backgroundCheck);
      formData.append('vehiclenumber', this.vehicleNumber);
      formData.append('payload', this.payload);
      formData.append('vehicle_type', this.vehicleType);
      formData.append('passengers', this.passengers);

      this.user.updateProfile(formData).subscribe(res => {
        let resp: any = res;
        console.log(resp);
        if (resp.status) {
          this.util.presentAlert('', 'Driver register successfully');
          this.storage.set('userData', JSON.stringify(resp.data)).then(() => {
            this.navCtrl.setRoot('MenuPage');
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
  vehicleRegistraionEvent(event) {
    this.vehicleRegistraion = event.target.files[0];
  };
  insuranceDocEvent(event) {
    this.insuranceDoc = event.target.files[0];
  };
  drivingLicenceEvent(event) {
    this.drivingLicence = event.target.files[0];
  };
  backgroundCheckEvent(event) {
    this.backgroundCheck = event.target.files[0];
  };
  vehicleProfileDocEvent(event) {
    this.vehicleProfile = event.target.files[0];
  };

  validate() {
    if (this.vehicleNumber == '') {
      this.util.presentToast('Please insert Vehicle Registration');
      return false;
    }
    if (this.drivingLicence == '') {
      this.util.presentToast('Please add your Driving Licence');
      return false;
    }
    if (this.insuranceDoc == '') {
      this.util.presentToast('Please add Vehicle Insurance');
      return false;
    }
    if (this.vehicleProfile == '') {
      this.util.presentToast('Please add Logbook');
      return false;
    }
    // if (this.backgroundCheck == '') {
    //   this.util.presentToast('Please add Background Check');
    //   return false;
    // }
    if (this.payload == '') {
      this.util.presentToast('Please add Payload');
      return false;
    }
    if (this.vehicleProfile == '') {
      this.util.presentToast('Please add Vehicle Profile');
      return false;
    }
    // if (this.vehicleRegistraion == ''){
    //   this.util.presentToast('Please add Vehicle Number');
    //   return false;
    // }
    if (this.passengers == '') {
      this.util.presentToast('Please select people');
      return false;
    }
    if (this.vehicleType == '') {
      this.util.presentToast('Please add Vehicle Type');
      return false;
    }
    return true;
  }
}

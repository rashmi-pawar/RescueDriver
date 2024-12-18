import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";
import {ActionSheetController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userData:any = '';
  fullName: any = '';
  mobileNumber: any = '';
  bio: any = '';
  profileImg: any = '';
  profileImgToShow: any = '';
  vehicleRegistraion: any = '';
  drivingLicence: any = '';
  insuranceDoc: any = '';
  backgroundCheck: any = '';
  vehicleProfile: any = '';
  vehicleNumber: any = '';
  vehicleType: any = '';
  payload: any = '' ;
  passengers: any;
  towType: any;
  constructor(public navCtrl: NavController,
              public storage : Storage,
              public util : UtilProvider,
              public user : User,
              public actionSheetCtrl:ActionSheetController,
              public navParams: NavParams) {
                // this.payload = localStorage.getItem('payload')
  }

  ionViewDidLoad() {
    this.getUserData();
    this.getType();
  }
  getType(){
    this.user.getVehicleType().subscribe(res=>{
      let resp :any = res;
      if (resp.status){
       this.towType = resp.data;
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  deleteAccount() {
    this.util.presentConfirm('Are you sure?','You want to delete your account').then(()=>{
      this.util.presentLoader();
      let data = {
        user_type:2,
        profile_id:this.userData.id
      }
      this.user.deleteAccount(data).subscribe(res=>{
        let resp : any = res;
        this.util.presentToast(resp.message);
        setTimeout(()=>{
          this.util.dismissLoader();
        },500)
        if (resp.status){
          this.storage.set('userData',null);
          this.navCtrl.setRoot('LoginPage');
        }
      },error => {
        console.log(error);
        this.util.dismissLoader();
      })
    }).catch(()=>{
    })
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.fullName = this.userData.username;
      this.mobileNumber = this.userData.phone_number;
      this.bio = this.userData.bio;
      this.profileImgToShow = this.userData.image;
      this.vehicleNumber = this.userData.vehiclenumber;
      this.vehicleType = this.userData.vehicle_type;
      this.payload = this.userData.payload;
      this.passengers = this.userData.passengers;
    })
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

  save() {
    if (this.fullName.toString().trim() ===''){
      this.util.presentToast('Enter FullName');
      return;
    }
    if (this.mobileNumber.toString().trim() ===''){
      this.util.presentToast('Enter Mobile Number');
      return;
    }
    this.util.presentLoader();

    let formData = new FormData();
    formData.append('full_name',this.fullName);
    formData.append('mobile',this.mobileNumber);
    formData.append('bio',this.bio.trim());
    formData.append('user_image',this.profileImg);
    formData.append('profile_id',this.userData.id);
    formData.append('vehicle_registration',this.vehicleRegistraion);
    formData.append('driving_licence',this.drivingLicence);
    formData.append('insurance_doc',this.insuranceDoc);
    formData.append('vehicle_image',this.vehicleProfile);
    formData.append('background_check',this.backgroundCheck);
    formData.append('vehiclenumber',this.vehicleNumber);
    formData.append('vehicle_type',this.vehicleType);
    formData.append('payload',this.payload);
    formData.append('passengers',this.passengers);
    localStorage.setItem('payload',this.payload);
    let data = {
      full_name:this.fullName,
       mobile:this.mobileNumber,
       bio:this.bio.trim(),
       user_image:this.profileImg,
       profile_id:this.userData.id,
       vehicle_registration:this.vehicleRegistraion,
       driving_licence:this.drivingLicence,
       insurance_doc:this.insuranceDoc,
       vehicle_image:this.vehicleProfile,
       background_check:this.backgroundCheck,
       vehiclenumber:this.vehicleNumber,
       vehicle_type:this.vehicleType

    }
    console.log(data);
    this.user.updateProfile(formData).subscribe(res=>{
      let resp : any = res;
      console.log(resp);
      this.util.presentAlert('',resp.message);
      if (resp.status){
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.navCtrl.pop();
        });
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },500)
    },error => {
      console.log(error);
      this.util.dismissLoader();
    })
  }

  openPicker() {
    let select = 'Choose or take a picture';
    let takePicture = 'Take a picture';
    let choosePicture = 'Choose picture';
    let actionSheet = this.actionSheetCtrl.create({
      title: select,
      buttons: [
        {
          text: takePicture,
          handler: () => {
            this.util.takePicture().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        },
        {
          text: choosePicture,
          handler: () => {
            this.util.aceesGallery().then(data => {
              this.profileImg = data;
              this.profileImgToShow = 'data:image/png;base64,' + data;
            });
          }
        }
      ]
    });
    actionSheet.present();
  }
}

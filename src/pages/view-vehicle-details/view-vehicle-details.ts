import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {UtilProvider} from "../../providers/util/util";
import {User} from "../../providers";
import {ModalController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-view-vehicle-details',
  templateUrl: 'view-vehicle-details.html',
})
export class ViewVehicleDetailsPage {

  userData:any='';
  vehicleRegistration: any = '';
  drivingLicence: any = '';
  insuranceDoc: any = '';
  vehicleImage: any = '';
  backgroundCheck: any = '';

  vehicleRegistrationView: any = 'Edit';
  drivingLicenceView: any = 'Edit';
  insuranceDocView: any = 'Edit';
  vehicleImageView: any = 'Edit';
  backgroundCheckView: any = 'Edit';
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public modal:ModalController,
              public user:User,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.getUserData();
  }

  view_details(url,document_type,documentName) {
    let mdl = this.modal.create('ChangeVehicleDetailsPage',{vehicleImage:url,documentName:documentName});
    mdl.present();
    mdl.onDidDismiss((res)=>{
      if (res.data && res.data.name && res.data.name !==''){
        if (document_type == 1){
          this.vehicleRegistrationView = res.data.name;
          this.vehicleRegistration = res.data;
        }else if (document_type == 2){
          this.drivingLicenceView = res.data.name;
          this.drivingLicence = res.data;
        }else if (document_type == 3){
          this.insuranceDocView = res.data.name;
          this.insuranceDoc = res.data;
        }else if (document_type == 4){
          this.vehicleImageView = res.data.name;
          this.vehicleImage = res.data;
        }else if (document_type == 5){
          this.backgroundCheckView = res.data.name;
          this.backgroundCheck = res.data;
        }
      }
    })
    // this.navCtrl.push('ChangeVehicleDetailsPage',{vehicleImage:url,document_type:document_type,profile_id:this.userData.id})
  }

  getUserData() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
    })
  }

  save() {
    this.util.presentLoader();
    let formData = new FormData();
    formData.append('profile_id',this.userData.id);
    // formData.append('document_type',this.document_type);
    formData.append('vehicle_registration',this.vehicleRegistration);
    formData.append('driving_licence',this.drivingLicence);
    formData.append('insurance_doc',this.insuranceDoc);
    formData.append('vehicle_image',this.vehicleImage);
    formData.append('background_check',this.backgroundCheck);
    this.user.driverDocumentUpload(formData).subscribe(res=>{
      let resp :any = res;
      if (resp.status){
        this.storage.set('userData',JSON.stringify(resp.data)).then(()=>{
          this.getUserData();
        });
        this.util.presentToast(resp.message);
        this.vehicleRegistration = '';
        this.drivingLicence = '';
        this.insuranceDoc = '';
        this.vehicleImage = '';
        this.backgroundCheck = '';

        this.vehicleRegistrationView = 'Edit';
        this.drivingLicenceView = 'Edit';
        this.insuranceDocView = 'Edit';
        this.vehicleImageView = 'Edit';
        this.backgroundCheckView = 'Edit';
      }
      setTimeout(()=>{
        this.util.dismissLoader();
      },300);
    },error => {
      console.error(error);
      this.util.dismissLoader();
    });
  }
}

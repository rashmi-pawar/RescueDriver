import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {User} from "../../providers";
import {UtilProvider} from "../../providers/util/util";
import {ViewController} from "ionic-angular/index";

@IonicPage()
@Component({
  selector: 'page-change-vehicle-details',
  templateUrl: 'change-vehicle-details.html',
})
export class ChangeVehicleDetailsPage {
  vehicleImage: any = '';
  fileData: any='';
  isVehicleChange:boolean=false;
  documentName: any = '';
  constructor(public navCtrl: NavController,
              public util:UtilProvider,
              public user:User,
              public viewCtrl:ViewController,
              public navParams: NavParams) {
    this.vehicleImage = navParams.data.vehicleImage;
    this.documentName = navParams.data.documentName;
  }

  ionViewDidLoad() {
  }
  vehicleRegistraionEvent(event) {
    this.fileData = event.target.files[0];
    let reader = new FileReader();
    let that = this;
    reader.onload = function(){
      // let output : any = document.getElementById('output');
      that.vehicleImage = reader.result;
      that.isVehicleChange=true;
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  change() {
    this.viewCtrl.dismiss({data:this.fileData})
  }

  back() {
    this.viewCtrl.dismiss({data:''});
  }
}

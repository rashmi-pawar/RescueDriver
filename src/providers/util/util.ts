import { Injectable } from '@angular/core';
import {AlertController, Loading, LoadingController, ToastController} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {User} from "..";
import {Storage} from "@ionic/storage";
import {HttpClient} from "@angular/common/http";
import moment from "moment";

@Injectable()
export class UtilProvider {
  base64Image: any;

  loading: Loading;
  loader: Loading;
  smallAlert: any;
  toast: any;
  constructor(public http: HttpClient,public toastCtrl:ToastController,
              private loadingCtrl: LoadingController,
              private user: User,
              private camera: Camera, private alertCtrl: AlertController, public storage: Storage) {
  }

  presentLoading(msg) {
    if (this.loading){
      this.dismissLoading();
    }else{
      this.loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: msg,
        duration: 6000
      });
      this.loading.present();
    }
  }
  presentLoader(msg?) {
    if (this.loader){
      this.dismissLoader();
    }else{
      this.loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: msg,
        // duration: 6000
      });
      this.loader.present();
    }
  }

  dismissLoader(){
    if(this.loader) {
      this.loader.dismiss();
      this.loader = null;
    }
  }
  dismissLoading(){
    if(this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }

  presentAlert(title,msg) {
    return new Promise((resolve, reject) => {
      if (!this.smallAlert) {
        this.smallAlert = this.alertCtrl.create({
          title: title,
          subTitle: msg,
          buttons: [{
            text: 'Ok',
            handler: () => {
              resolve();
              this.smallAlert = null;
            }
          }]
        });
        this.smallAlert.present();
      }
    })
  }

  presentToast(message) {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    this.toast.present();
  }


  presentConfirm(title, msg) {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: msg,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              reject();
            }
          },
          {
            text: 'Ok',
            handler: () => {
              resolve();
            }
          }
        ]
      });
      alert.present();
    })
  }
  // take picture from camera
  takePicture() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        quality:70,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        resolve(imageData)
      }, (err) => {
        reject(err);
      });
    })
  }

  // access gallery method
  aceesGallery() {
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
        quality:70,
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        resolve(imageData)
      }, (err) => {
        reject(err);
      });
    });
  }

  timeSince(date:any) {
    return moment(date).fromNow()
  }

  randomImg(){
    let randomNumber = Math.floor(Math.random() * 1000) + 1;
    return "image" + randomNumber;
  }
}

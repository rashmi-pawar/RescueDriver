import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FirebaseProvider} from "../../providers/firebase/firebase";
import {UtilProvider} from "../../providers/util/util";
import {Storage} from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  allUsers:any=[];
  userData:any={};
  isListEmpty:boolean=false;
  constructor(public navCtrl: NavController,
              public storage:Storage,
              public util:UtilProvider,
              public firedb:FirebaseProvider,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.storage.get('userData').then(userData=>{
      this.userData = JSON.parse(userData);
      this.util.presentLoader();
      this.firedb.getAllUsers(this.userData.id+'_D').subscribe(data=>{
        if (data && data.length){
          this.allUsers = data;
          this.allUsers = this.allUsers.filter(item=>{
            this.firedb.getFirstChat(item.id+'-'+this.userData.id+'_D').subscribe(data=>{
              if (data && data[0]){
                item.last_message = data[0]['message'];
                item.last_message_time = data[0]['date'];
              }else {
                //if latest message is undefined then check again for latest message
                this.firedb.getFirstChat(item.id+'-'+this.userData.id+'_D').subscribe(data => {
                  item.last_message = data[0]['message'];
                  item.last_message_time = data[0]['date'];
                })
              }
            })
            return item;
          })
        }
        this.allUsers.length && this.allUsers.length>0?this.isListEmpty=false:this.isListEmpty=true;
        console.log('all users >>>',this.allUsers);
        setTimeout(()=>{
          this.util.dismissLoader();
        },500);
      });
    })
  }

  notificaion(){
    this.navCtrl.push("NotificationsPage");
  }
  openChat(customer){
    let chatRef = customer.id+'-'+this.userData.id+'_D';
    this.navCtrl.push("ChatPage",{chatRef:chatRef,customer:customer,driver:this.userData});
  }
}

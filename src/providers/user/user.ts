import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';

@Injectable()
export class User {

  loginUrl: string = 'Authentication/login_user';
  driver_registration: string = 'Authentication/driver_registration';
  forgetPasswordUrl: string = 'Authentication/ForgetPassword';
  deleteAccountUrl: string = 'Authentication/DeleteAccount';
  logoutUrl: string = 'Authentication/logout';
  getContentUrl: string = 'Authentication/getcontent';
  driver_update_profile: string = 'Authentication/driver_update_profile';

  get_booking_request: string = 'Drivers/get_booking_request';
  get_route_details: string = 'Drivers/get_route_details';
  accept_booking_request: string = 'Drivers/accept_booking_request';
  my_history: string = 'Drivers/my_history';
  trip_start_end: string = 'Drivers/trip_start_end';
  update_user_lat_lang: string = 'Users/update_user_lat_lang';
  get_notification_list: string = 'Users/get_notification_list';
  clear_notification: string = 'Users/clear_notification';
  driver_document_upload: string = 'Authentication/driver_document_upload';
  generate_otp: string = 'Authentication/generateOtp';
  verify_otp: string = 'Authentication/verifyOtp';
  update_login_status: string = 'Users/update_login_status';
  // driver_document_upload : string = 'Authentication/driver_document_upload';
  // Users/driver_arrive_notification
  get_vehicle_type: string = 'Users/get_vehicle_type';
  driver_arrive_notification: string = 'Users/driver_arrive_notification';
  cancel_booking_notification_for_driver: string = 'Drivers/cancel_booking_notification_for_driver';
  driver_loaded_notification: string = 'Users/driver_loaded_notification';
  send_user_notification : string = 'Drivers/send_driver_notification';


  constructor(public api: Api) { }

  login(accountInfo: any) {
    let res = this.api.post(this.loginUrl, accountInfo).share();
    return res;
  }

  signup(accountInfo: any) {
    let res = this.api.post(this.driver_registration, accountInfo).share();
    return res;
  }

  forgetPassword(data: any) {
    let res = this.api.post(this.forgetPasswordUrl, data).share();
    return res;
  }
  deleteAccount(data: any) {
    let res = this.api.post(this.deleteAccountUrl, data).share();
    return res;
  }
  logout(data: any) {
    let res = this.api.post(this.logoutUrl, data).share();
    return res;
  }
  getContent(data: any) {
    let res = this.api.post(this.getContentUrl, data).share();
    return res;
  }
  updateProfile(data: any) {
    let res = this.api.post(this.driver_update_profile, data).share();
    return res;
  }
  getAllBookings(data: any) {
    let res = this.api.post(this.get_booking_request, data).share();
    return res;
  }
  getRouteDetails(data: any) {
    let res = this.api.post(this.get_route_details, data).share();
    return res;
  }
  getHistory(data: any) {
    let res = this.api.post(this.my_history, data).share();
    return res;
  }
  tripStartEnd(data: any) {
    let res = this.api.post(this.trip_start_end, data).share();
    return res;
  }

  updateLatLng(data: any) {
    let res = this.api.post(this.update_user_lat_lang, data).share();
    return res;
  }

  getAllNotificationList(data: any) {
    let res = this.api.post(this.get_notification_list, data).share();
    return res;
  }

  clearNotification(data: any) {
    let res = this.api.post(this.clear_notification, data).share();
    return res;
  }
  acceptBooking(data: any) {
    let res = this.api.post(this.accept_booking_request, data).share();
    return res;
  }
  driverDocumentUpload(data: any) {
    let res = this.api.post(this.driver_document_upload, data).share();
    return res;
  }

  generateOtp(data: any) {
    let res = this.api.post(this.generate_otp, data).share();
    return res;
  }
  verifyOtp(data: any) {
    let res = this.api.post(this.verify_otp, data).share();
    return res;
  }
  onlineOffline(data: any) {
    let res = this.api.post(this.update_login_status, data).share();
    return res;
  }
  driverArr(data: any) {
    let res = this.api.post(this.driver_arrive_notification, data).share();
    return res;
  }
  cancelRideByUser(data: any) {
    let res = this.api.post(this.cancel_booking_notification_for_driver, data).share();
    return res;
  }
  getVehicleType() {
    let res = this.api.get(this.get_vehicle_type).share();
    return res;
  }
  postVehicleLoaded(data: any) {
    let res = this.api.post(this.driver_loaded_notification, data).share();
    return res;
  }
  messageNotification(data: any) {
    let res = this.api.post(this.send_user_notification, data).share();
    return res;
  }
}

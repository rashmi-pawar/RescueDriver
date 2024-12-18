import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { UtilProvider } from "../../providers/util/util";
import { User } from "../../providers";
import { Geolocation } from "@ionic-native/geolocation";
import { FirebaseProvider } from "../../providers/firebase/firebase";

declare var google;
@IonicPage()
@Component({
  selector: 'page-track-location',
  templateUrl: 'track-location.html',
})
export class TrackLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  lat1: any = '';
  long1: any = '';
  lat2: any = '';
  long2: any = '';
  tripData: any = {};
  userData: any = {};
  map: any = '';
  interval: any;
  showArrived: any;
  Lng: number;
  Lat: number;
  markers = [];
  driverIntervalNew: any;
  checkCancelBookingInterval: any;
  loadedVehicle: any;
  constructor(public navCtrl: NavController,
    public util: UtilProvider,
    public user: User,
    public firedb: FirebaseProvider,
    public storage: Storage,
    public geolocation: Geolocation,
    public navParams: NavParams) {
    this.showArrived = localStorage.getItem('isArrived');
    // if (this.showArrived == 'true') {
    //   this.showArrived = 'false';
    // } else {
    //   this.showArrived = 'true';
    // }
    // console.log(this.showArrived);
    this.loadedVehicle = localStorage.getItem('loadedVehicle');
    // loadedVehicle
    this.storage.get('startedTripData').then(startedTripData => {
      this.tripData = startedTripData;
      // console.log('check trip data >>>>>>>',this.tripData);
      let to = new google.maps.LatLng(this.tripData.pick_latitude, this.tripData.pick_longitude);
      let from = new google.maps.LatLng(this.tripData.drop_latitude, this.tripData.drop_longitude);
      // this.calculateAndDisplayRoute(to,from,this.tripData);
    })
    this.initMap();
    this.checkCancelBooking();
    this.checkCancelBookingInterval = setInterval(() => {
      this.checkCancelBooking();
    }, 3000);
  }


  ionViewDidLoad() {
    // this.util.presentLoader('Fetching Route');
    this.storage.get('userData').then(userData => {
      // this.initMap();
      this.userData = JSON.parse(userData);
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.updateDriverLocation();
      this.driverIntervalNew = setInterval(() => {
        this.updateDriverLocation();
      }, 5000)
    })
    // setTimeout(() => {
    //   this.util.dismissLoader();
    // }, 15000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  notificaion() {
    this.navCtrl.push("NotificationsPage");
  }

  chat() {
    console.log('this.tripData', this.tripData);
    let customer = {
      date_of_join: new Date().getTime(),
      id: this.tripData.customer_id + '_C',
      image: this.tripData.image,
      isDriver: false,
      name: this.tripData.first_name + ' ' + this.tripData.last_name
    }
    this.firedb.addUser(customer, this.userData.id + '_D');
    let chatRef = this.tripData.customer_id + '_C' + '-' + this.userData.id + '_D';
    this.navCtrl.push('ChatPage', { chatRef: chatRef, customer: customer, driver: this.userData });
  }

  calculateAndDisplayRoute(from, to, allData: any) {
    const that = this;
    this.directionsService.route({
      origin: from,
      destination: to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.lat1 = allData.pick_latitudei;
        that.long1 = allData.pick_longitudei;
        that.lat2 = allData.pick_latitude;
        that.long2 = allData.pick_longitude;
        that.directionsDisplay.setDirections(response);
        that.loadMap();
      }
    });
  }
  calculateAndDisplayRouteNext(from, to, allData: any) {
    const that = this;
    this.directionsService.route({
      origin: from,
      destination: to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.lat1 = allData.pick_latitudei;
        that.long1 = allData.pick_longitudei;
        that.lat2 = allData.drop_latitude;
        that.long2 = allData.drop_longitude;
        that.directionsDisplay.setDirections(response);
        that.loadMap();
      }
    });
  }
  loadMap() {
    // if (!this.showArrived) {
    this.initMapOnLoad();
    // }
    //   var icon = {
    //     url: 'assets/img/dot.png', // url
    //     scaledSize: new google.maps.Size(50, 50), // scaled size
    //     origin: new google.maps.Point(0,0), // origin
    //     anchor: new google.maps.Point(0, 0) // anchor
    // };
    // this.clearMarkers();
    let startMarker = new google.maps.Marker({
      position: {
        lat: parseFloat(this.lat1),
        lng: parseFloat(this.long1)
      }, map: this.map, icon: 'assets/img/LocationTruck.png'
    });

    startMarker = new google.maps.Marker({
      position: {
        lat: parseFloat(this.lat2),
        lng: parseFloat(this.long2)
      }, map: this.map, icon: 'assets/img/green-dot.png'
    });
    // this.directionsDisplay.setMap(null);
    this.directionsDisplay.setMap(this.map, startMarker);
    this.directionsDisplay.setOptions({
      polylineOptions: {
        strokeColor: '#752264'
      },
      suppressMarkers: true,

      // preserveViewport: true
    });
    // this.addMarker()
    // this.map.setCameraBearing(90)
    // startMarker.setRotation(32)
  }

  initMap() {
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      // console.log('lat >>',resp.coords.latitude,'lng >>',resp.coords.longitude);
      this.Lat = resp.coords.latitude;
      this.Lng = resp.coords.longitude;
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    })
  }
  initMapOnLoad() {
    let mapOptions = {
      zoom: 15,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
  updateDriverLocation() {
    // console.log('updateDriverLocation');
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      let rawData = {
        "user_id": this.userData.id,
        "latitude": resp.coords.latitude,
        "longitude": resp.coords.longitude,
        "user_type": "2"
      }
      this.user.updateLatLng(rawData).subscribe(res => {
        // console.log('driverdata',res);
        this.tripData.pick_latitudei = resp.coords.latitude;
        this.tripData.pick_longitudei = resp.coords.longitude;
        let to = new google.maps.LatLng(this.tripData.pick_latitudei, this.tripData.pick_longitudei);
        let from = new google.maps.LatLng(this.tripData.pick_latitude, this.tripData.pick_longitude);
        let from1 = new google.maps.LatLng(this.tripData.drop_latitude, this.tripData.drop_longitude);
        if (to == from) {
          this.calculateAndDisplayRouteNext(to, from1, this.tripData);
        }
        if (to != from) {
          this.calculateAndDisplayRoute(to, from, this.tripData);
        }

      }, error => {
        console.log(error);
      })
    });
  }

  call() {
    if (this.tripData.mobile && this.tripData.mobile !== '') {

    } else {
      this.util.presentToast('Currently customer mobile number is not available');
    }
  }

  end() {
    localStorage.setItem('isArrived', 'true');
    localStorage.setItem('loadedVehicle', 'true');
    this.util.presentConfirm('Trip End', 'Are you sure want to end the trip?').then(() => {
      this.util.presentLoader();
      let data = {
        "driver_id": this.userData.id,
        "booking_id": this.tripData.id,
        "latitude": "",
        "longitude": "",
        "trip_status": "2"
      }
      this.user.tripStartEnd(data).subscribe(res => {
        let resp: any = res;
        if (resp.status) {
          this.storage.set('startedTripData', null).then(() => {
            if (this.checkCancelBookingInterval) {
              clearInterval(this.checkCancelBookingInterval);
            }
            this.navCtrl.setRoot("MenuPage");
          })
        } else {
          this.util.presentToast(resp.message);
        }
        setTimeout(() => {
          this.util.dismissLoader();
        }, 500)
      }, error => {
        console.error(error);
        this.util.dismissLoader();
      })
    }).catch(() => { })

  }
  loadedVehicleData() {
    let data = {
      "booking_id": this.tripData.id,
    }
    console.log("loadedVehicleData", data)
    this.user.postVehicleLoaded(data).subscribe(res => {
      let resp: any = res;
      console.log(resp);
      if (resp.status) {
        localStorage.setItem('loadedVehicle', 'true');
        this.loadedVehicle = 'true';
        this.util.presentToast(resp.message);
      } else {
        this.util.presentToast(resp.message);
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500)
    }, error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }
  arrived() {
    this.showArrived = false;
    this.loadedVehicle = 'false';
    localStorage.setItem('isArrived', 'true');
    localStorage.setItem('loadedVehicle', 'false');
    // this.util.presentConfirm('Arrived at pick up location','Are you sure you reach the pickup point?');
    this.util.presentLoader("");
    if (this.driverIntervalNew) {
      clearInterval(this.driverIntervalNew);
    }

    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
      let rawData = {
        "user_id": this.userData.id,
        "latitude": resp.coords.latitude,
        "longitude": resp.coords.longitude,
        "user_type": "2"
      }
      this.user.updateLatLng(rawData).subscribe(res => {
        // console.log(this.tripData);
        this.tripData.pick_latitudei = resp.coords.latitude;
        this.tripData.pick_longitudei = resp.coords.longitude;
        let to = new google.maps.LatLng(this.tripData.pick_latitudei, this.tripData.pick_longitudei);
        let from = new google.maps.LatLng(this.tripData.pick_latitude, this.tripData.pick_longitude);
        let from1 = new google.maps.LatLng(this.tripData.drop_latitude, this.tripData.drop_longitude);
        this.calculateAndDisplayRouteArrive(from, from1, this.tripData);
        this.interval = setInterval(() => {
          this.calculateAndDisplayRouteArrive(from, from1, this.tripData);
        }, 5000)
        this.util.dismissLoader();

      }, error => {
        console.log(error);
      })
    });
    let data = {
      "booking_id": this.tripData.id,
    }
    // console.log("id", data)
    this.user.driverArr(data).subscribe(res => {
      let resp: any = res;
      // console.log(resp);
      if (resp.status) {
        this.util.presentToast(resp.message);
      } else {
        this.util.presentToast(resp.message);
      }
      setTimeout(() => {
        this.util.dismissLoader();
      }, 500)
    }, error => {
      console.error(error);
      this.util.dismissLoader();
    })
  }

  calculateAndDisplayRouteArrive(from, to, allData: any) {
    const that = this;
    this.directionsService.route({
      origin: from,
      destination: to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        that.lat1 = allData.pick_latitude;
        that.long1 = allData.pick_longitude;
        that.lat2 = allData.drop_latitude;
        that.long2 = allData.drop_longitude;
        that.directionsDisplay.setDirections(response);
        that.loadMap();
      }
    });
  }
  checkCancelBooking() {
    let data = {
      "booking_id": this.tripData.id
    }
    this.user.cancelRideByUser(data).subscribe(res => {
      let resp: any = res;
      // console.log(resp);
      if (resp.status) {
        this.util.presentAlert('Notification', 'Ride cancelled by customer');
        if (this.checkCancelBookingInterval) {
          clearInterval(this.checkCancelBookingInterval);
        }
        this.navCtrl.setRoot('MenuPage');
        this.storage.set('startedTripData', null);
      }
    }, error => {
      console.log(error);
    });
  }
}

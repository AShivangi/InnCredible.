import { Component, OnInit, ViewChild } from '@angular/core';
import { HotelInfo } from '../services/hotel-info';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { Hotel } from '../models/hotel';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-hotel-info',
  templateUrl: './hotel-info.component.html',
  styleUrls: ['./hotel-info.component.scss']
})

export class HotelInfoComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  //map: google.maps.Map;
  public imagesURL: URL[] = [];
  public imgDone: boolean = false;

  private hotelID: string;
  returnedcheckindate: string;
  returnedcheckoutdate: string;

  private id: string;
  public sub: any;
  public hotel: Hotel;

  public miami: boolean;
  public sf: boolean;
  public ny:boolean;
  public boston:boolean;
  public la: boolean;

  constructor(public hotelInfo: HotelInfo, private route: ActivatedRoute) {
    // this.hotelInfo.setHotelId('0');
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.hotelID = params['id'];
      this.returnedcheckindate = params['id2'];
      this.returnedcheckoutdate = params['id3'];
    });

    this.hotel = new Hotel();
    this.hotelInfo = new HotelInfo();
    const id_ref = firebase.database().ref('/hotel_id');
    id_ref.once('value').then((snapshot) => {
      const count = snapshot.numChildren();
      for (var i = 0; i < count; i++) {
        const number = i.toString();
        if (snapshot.child(number).val() == this.hotelID) {
          this.getData(number);
         // this.hotelInfo.retrieveAmenities(number);
          const images_ref = firebase.database().ref('/hotels/' + number + '/images/');
          
          images_ref.once('value')
            .then((snapshot_img) => {
              const countImage = snapshot_img.numChildren();
              for (var i = 0; i < countImage; i++) {
                var number = i.toString();
                this.setImagesURL(snapshot_img.child(number).val());
                if (i == countImage - 1) {
                  this.setImgDone();
                }
              }
            });
          i = count;
        }
      }
    });
    

  }

  async getLocation(address: string) {
    var geocoder = new google.maps.Geocoder();
    var latitude: number;
    var longitude: number;
    var gElement = this.gmapElement;
    var map: google.maps.Map;
    geocoder.geocode({ 'address': address }, await function (results, status) {

      if (status == google.maps.GeocoderStatus.OK) {
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();

        var mapProp = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(gElement.nativeElement, mapProp);
        var marker;
        var markerOptions = {
          position: new google.maps.LatLng(latitude, longitude),
          map: map,
          title: address,
          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
        };
        marker = new google.maps.Marker(markerOptions);
      }
    });


  }

  setMarker(map, position, title) {

  }

  public async getData(number) {
    var promise = await this.hotelInfo.getHotelData(number);
    this.hotel = this.hotelInfo.getHotel();
    this.getLocation(this.hotel.location);
    this.getcity(this.hotel.location);
  }

  public setImagesURL(image) {
    this.imagesURL.push(image);
  }

  public setImgDone() {
    this.imgDone = true;
  }

  async getcity(address: string){
    if(this.hotel.city=="Miami"){
      this.miami=true;
    }
    if(this.hotel.city=="San Francisco"){
      this.sf=true;
    }
    if(this.hotel.city=="New York"){
      this.ny=true;
    }
    if(this.hotel.city=="Boston"){
      this.boston=true;
    }
    if(this.hotel.city=="Los Angeles"){
      this.la=true;
    }

  }


}
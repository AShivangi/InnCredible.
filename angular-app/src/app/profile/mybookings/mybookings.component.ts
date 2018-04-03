import { Component, OnInit } from '@angular/core';
import { UserProfileService } from '../../services/profile.service';
import { Reservation } from '../../booking/shared/reservation.model';
import { Hotel } from "../../models/hotel";
import { HotelInfo } from '../../services/hotel-info';
import { Booking } from '../../models/booking';
import * as firebase from 'firebase';

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.scss']
})
export class MybookingsComponent implements OnInit {

  reservations: Reservation[];
  bookings: Booking[] = [];


  constructor(public userProfileService: UserProfileService, private hotelInfo: HotelInfo) { }

  ngOnInit() {
    this.pullReservations();
    this.userProfileService.getUserInfo();
  }

  public async pullReservations() {
    await this.userProfileService.getReservations();
    this.reservations = this.userProfileService.reservation;
    let numRes = this.reservations.length;

    for (let i = 0; i < numRes; i++) {
      var num = i.toString();
      var hotel = new Hotel();
      var booking = new Booking();

      const id_ref = firebase.database().ref('/hotel_id');
      var index;
      await id_ref.once('value').then((snapshot) => {
        const count = snapshot.numChildren();
        for (var i = 0; i < count; i++) {
          const number = i.toString();
          if (snapshot.child(number).val() == this.reservations[num].hotelID) {
            index = number;
            break;
          }
        }
      });
      await this.hotelInfo.getHotelData(index);
      hotel = this.hotelInfo.getHotel();
      booking.hotelName = hotel.name;
      booking.hotelLoc = hotel.location;
      booking.$key = this.reservations[num].$key;
      booking.checkInDt = this.reservations[num].checkInDt;
      booking.checkOutDt = this.reservations[num].checkOutDt;
      booking.comments = this.reservations[num].comments;
      booking.guests = this.reservations[num].guests;
      booking.rooms = this.reservations[num].rooms;
      this.bookings.push(booking);
    }
  }


}
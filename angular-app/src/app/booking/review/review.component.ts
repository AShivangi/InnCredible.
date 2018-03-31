import { Component, OnInit } from '@angular/core';
import { HotelInfo } from '../../services/hotel-info';
import { Hotel } from '../../models/hotel';
import { UserProfileService } from '../../services/profile.service';
import { Subscription } from 'rxjs/Subscription';
import { ReservationService } from '../shared/reservation.service';
import { Reservation } from '../shared/reservation.model';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase';
import {SenditineraryinformationService} from "../../services/senditineraryinformation.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  private taxRate: number;
  private hotelData: Hotel;
  private reservation: Reservation;
  private subscription: Subscription;

  constructor(private hotel: HotelInfo
              , private reservationService: ReservationService
              , private userProfileService: UserProfileService,
              private service: SenditineraryinformationService) {
    this.subscription = this.hotel.activeHotel.subscribe(value => this.hotelData = value);
    this.reservationService.activeReservation.subscribe(value => this.reservation = value);
    this.taxRate = 8.25;
    this.service = service;
  }

  ngOnInit() {
  }

  applyRewardAmnt(): number {
    if (!this.userProfileService.isRedeem) {
      return 0;
    }
    return this.userProfileService.getRewardPoints() / 25;
  }

  roomCharge(): number {
    return (parseFloat(this.hotelData.price) * this.reservation.nights * this.reservation.rooms);
  }

  taxCharge(): number {
    return this.roomCharge() * (this.taxRate / 100);
  }

  orderTotal(): number {
    return this.roomCharge() + this.taxCharge() - this.applyRewardAmnt();
  }

  public async onClick() {
    // alert(this.orderTotal());
    this.reservation.totalCost = this.orderTotal();
    this.reservationService.changeReservation(this.reservation);
    const promise = this.userProfileService.awardRewardPoints(this.roomCharge());

    await promise;
    //name, address, guests, rooms, checkindate, checkoutdate, tbt, rewards, tax, total
    this.service.saveInformation(this.hotelData.name, this.hotelData.description, this.reservation.guests,
      this.reservation.rooms, this.reservation.checkInDt, this.reservation.checkOutDt,
      this.roomCharge(), this.applyRewardAmnt(),this.taxCharge(),this.reservation.totalCost, firebase.auth().currentUser.email);
    console.log("INSIDE CLICK");

  }
}

import { ApiServiceService } from './../service/api-service.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { HotelListingPageComponent } from '../panel-user/hotel-listing-page/hotel-listing-page.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  // ! select Date span
  toDate: any;
  fromDate: any;
  todaysDate: any;
  tomorrowsDate: any;

  // ! select room and guests
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  hotelDetailsArray = Array();

  @Output() updateLocation = new EventEmitter<string>();

  constructor(
    public router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public ApiServiceService: ApiServiceService,
    private datePipe: DatePipe
  ) {
    // console.log('welcome page');
  }

  ngOnInit(): void {
    this.onLoadPage();
  }

  // #region //! SELECT TO DATE FROM DATE
  onLoadPage() {
    //! DATE
    this.todaysDate = new Date();
    let d = new Date();
    this.tomorrowsDate = new Date(d.setDate(d.getDate() + 1));

    this.ApiServiceService.TODATE = this.datePipe.transform(
      this.todaysDate,
      'EEE, d MMM'
    );

    this.ApiServiceService.FROMDATE = this.datePipe.transform(
      this.tomorrowsDate,
      'EEE, d MMM'
    );

    localStorage.setItem('TODATE', this.ApiServiceService.TODATE);
    localStorage.setItem('FROMDATE', this.ApiServiceService.FROMDATE);
    localStorage.setItem('toDate', this.datePipe.transform(this.todaysDate, 'y-M-d hh:mm:ss') || '');
    localStorage.setItem('fromDate', this.datePipe.transform(this.tomorrowsDate, 'y-M-d hh:mm:ss') || '');

  }

  onDateSelected() {
    this.ApiServiceService.TODATE = this.datePipe.transform(
      this.ApiServiceService.toDate,
      'EEE, d MMM'
    );
    this.ApiServiceService.FROMDATE = this.datePipe.transform(
      this.ApiServiceService.fromDate,
      'EEE, d MMM'
    );

    this.loadDatesInLocal();
  }

  loadDatesInLocal() {
    localStorage.setItem('TODATE', this.ApiServiceService.TODATE);
    localStorage.setItem('FROMDATE', this.ApiServiceService.FROMDATE);
    localStorage.setItem('toDate', this.datePipe.transform(this.toDate, 'y-M-d hh:mm:ss') || '');
    localStorage.setItem('fromDate', this.datePipe.transform(this.fromDate, 'y-M-d hh:mm:ss') || '');
  }

  // #endregion //! SELECT TO DATE FROM DATE
  // ! Swiper
  onSwiper(swiper: any) {
    // console.log(swiper);
  }

  onSlideChange() {
    // console.log('slide change');
  }

  openBookingPage() {
    this.router.navigate(['/booking-page'], { relativeTo: this.route });
  }

  onchangeLocation(event: any) {
    this.ApiServiceService.LOCATION = event;
    localStorage.setItem('location', event);
  }

  totRooms(event: any) {
    // console.log(event);
    // this.totalRooms = event;
    // localStorage.setItem('totalRooms', event);
  }

  totGuests(event: any) {
    // console.log(event);
    // this.totalGuests = event;
    // localStorage.setItem('totalGuests', event);
  }

  onLogin() { }
}

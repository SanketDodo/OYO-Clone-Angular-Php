import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { WelcomePageComponent } from 'src/app/welcome-page/welcome-page.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  setLocation: any;
  locationList = Array();

  @Output() location = new EventEmitter<string>();
  @Output() totRoomsAndGuest = new EventEmitter<any>();

  // ! select Date span
  toDate: any;
  fromDate: any;
  todaysDate: any;
  tomorrowsDate: any;

  public welcomePage: WelcomePageComponent;

  constructor(
    public datePipe: DatePipe,
    public ApiServiceService: ApiServiceService
  ) {
    this.ApiServiceService.getLocation();
    this.ApiServiceService.toDate = localStorage.getItem('toDate');
    this.ApiServiceService.fromDate = localStorage.getItem('fromDate');
    this.ApiServiceService.TODATE = localStorage.getItem('TODATE');
    this.ApiServiceService.FROMDATE = localStorage.getItem('FROMDATE');
    this.ApiServiceService.TOTALROOMS = localStorage.getItem('totalRooms');
    this.ApiServiceService.TOTALGUEST = localStorage.getItem('totalGuests');
    
  }

  ngOnInit(): void { }

  onDateSelected() {
    this.ApiServiceService.TODATE = this.datePipe.transform(
      this.ApiServiceService.toDate,
      'EEE, d MMM'
    );
    this.ApiServiceService.FROMDATE = this.datePipe.transform(
      this.ApiServiceService.fromDate,
      'EEE, d MMM'
    );

    localStorage.setItem('TODATE', this.ApiServiceService.TODATE);
    localStorage.setItem('FROMDATE', this.ApiServiceService.FROMDATE);
    localStorage.setItem('toDate', this.ApiServiceService.toDate);
    localStorage.setItem('fromDate', this.ApiServiceService.fromDate);

  }

  onchangeLocation(event: any) {
    localStorage.setItem('location', event);
    this.location.emit(event);
    this.ApiServiceService.LOCATION = event;
  }

  totRooms(events: any) {
    console.log('events from nav->>', events);
    this.totRoomsAndGuest.emit(events);
  }

}

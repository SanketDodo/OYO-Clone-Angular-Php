import { HttpClient } from '@angular/common/http';
import {
  EventEmitter,
  Injectable,
  Output,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Observable, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  // baseUrl = 'http://192.168.5.116/Love2ServeERP/';
  baseUrl = 'http://kalamb-beach.in/backend/';
  // baseUrl = 'http://192.168.0.106:8080/kb/';

  // ! SEARCH-BAR Veriables
  locationList = Array();
  LOCATION: any;
  TODATE: any;
  FROMDATE: any;

  TOTALROOMS: any = 0;
  TOTALGUEST: any = 0;
  ROOM_GUEST_ARRAY = Array();

  // ! select Date span
  toDate: any;
  fromDate: any;
  todaysDate = new Date();
  tomorrowsDate: any;

  // ! User Data
  userId = 0;
  username = '';
  email = '';
  mobile = '';

  // Booking Data Array
  BookData = Array();

  // ! sackbar position
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  @Output() dateChnages = new EventEmitter<any>();

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public cookieService: CookieService
  ) {
    this.onConstructorLoad();
  }

  public httpcall(url: any) {
    // console.log('this is url' + url);
    return this.httpClient.get(this.baseUrl + url).pipe<any>(
      map((data) => {
        return data;
      })
    );
  }

  public httppostcall(url: any, data: any) {
    // console.log(url + JSON.stringify(data));
    return this.httpClient.post<any>(this.baseUrl + url, data).pipe(
      map((data1) => {
        return data1;
      })
    );
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onload() {
    var totRooms = localStorage.getItem('totalRooms');
    var totguests = localStorage.getItem('totalGuests');
    this.TOTALROOMS = parseInt(totRooms!);
    this.TOTALGUEST = parseInt(totguests!);
    this.ROOM_GUEST_ARRAY = JSON.parse(
      localStorage.getItem('ROOM_GUEST_ARRAY') || '[]'
    );
  }

  // ! GEt LOCATION
  async getLocation() {
    await this.httpcall('Fetch/get_location_by_city').subscribe((res) => {
      if (res['response_code'] == 1) {
        this.locationList = res['data'];
        this.locationList.unshift({ city: 'All Locations' });
        this.locationList.sort();

        const location = localStorage.getItem('location');

        console.log('this.locationList->>', location);

        if (location == undefined || location == null) {
          this.LOCATION = this.locationList[0]['city'];
          localStorage.setItem('location', this.LOCATION);
        } else if (location != undefined && location != null) {
          this.LOCATION = location;
        }
      } else {
        console.log('locations are not found!');
      }
    });
  }

  //! SELECT TO DATE FROM DATE
  onDateLoad() {
    //! DATE
    this.todaysDate = new Date();
    let d = new Date();
    this.tomorrowsDate = new Date(d.setDate(d.getDate() + 1));
    this.TODATE = this.datePipe.transform(this.todaysDate, 'EEE, d MMM');
    this.FROMDATE = this.datePipe.transform(this.tomorrowsDate, 'EEE, d MMM');

    localStorage.setItem('TODATE', this.TODATE);
    localStorage.setItem('FROMDATE', this.FROMDATE);
    localStorage.setItem(
      'toDate',
      this.datePipe.transform(this.todaysDate, 'y-MM-dd') || ''
    );
    localStorage.setItem(
      'fromDate',
      this.datePipe.transform(this.tomorrowsDate, 'y-MM-dd') || ''
    );
  }

  onDateSelected() {
    // console.log('todate->>', this.toDate);
    this.TODATE = this.datePipe.transform(this.toDate, 'EEE, d MMM');
    this.FROMDATE = this.datePipe.transform(this.fromDate, 'EEE, d MMM');

    localStorage.setItem('TODATE', this.TODATE);
    localStorage.setItem('FROMDATE', this.FROMDATE);
    localStorage.setItem(
      'toDate',
      this.datePipe.transform(this.toDate, 'y-MM-dd') || ''
    );
    localStorage.setItem(
      'fromDate',
      this.datePipe.transform(this.fromDate, 'y-MM-dd') || ''
    );

    this.toDate = this.datePipe.transform(this.toDate, 'y-MM-dd') || '';
    this.fromDate = this.datePipe.transform(this.fromDate, 'y-MM-dd') || '';

    this.dateChnages.emit(this.toDate);
  }

  onConstructorLoad() {
    var totRooms = localStorage.getItem('totalRooms');
    var totguests = localStorage.getItem('totalGuests');
    this.TOTALROOMS = parseInt(totRooms!);
    this.TOTALGUEST = parseInt(totguests!);
    // console.log('api service');
    if (
      (this.TOTALROOMS == null && this.TOTALGUEST == null) ||
      (this.TOTALROOMS == undefined && this.TOTALGUEST == undefined) ||
      (Number.isNaN(this.TOTALROOMS) && Number.isNaN(this.TOTALGUEST))
    ) {
      localStorage.setItem('totalRooms', JSON.stringify(1));
      localStorage.setItem('totalGuests', JSON.stringify(2));

      this.ROOM_GUEST_ARRAY.push({
        rooms: 1,
        guests: 2,
      });

      localStorage.setItem(
        'ROOM_GUEST_ARRAY',
        JSON.stringify(this.ROOM_GUEST_ARRAY)
      );
    }

    this.onload();
    const check_date = localStorage.getItem('TODATE');

    if (check_date) {
      this.TODATE = localStorage.getItem('TODATE');
      this.FROMDATE = localStorage.getItem('FROMDATE');
    } else {
      this.onDateLoad();
    }

    // ! loginCheck
    this.getLoginCookies();
    this.getLocation();
  }

  getLoginCookies() {
    var cookies = this.cookieService.get('%$#l5%o5%g6%i7%n4%C4%r5%6e%d5%');
    if (cookies) {
      this.username = JSON.parse(cookies)['username'];
      this.email = JSON.parse(cookies)['email'];
      this.mobile = JSON.parse(cookies)['mobile'];
    } else {
      this.username = '';
      this.email = '';
      this.mobile = '';
    }
  }

  setLoginCookies(data: any) {
    this.cookieService.set(
      '%$#l5%o5%g6%i7%n4%C4%r5%6e%d5%',
      JSON.stringify(data)
    );
    this.getLoginCookies();
  }

  delCookie() {
    //set loginData
    this.cookieService.delete('%$#l5%o5%g6%i7%n4%C4%r5%6e%d5%');
    this.router.navigate(['/welcome-page']);
    location.reload();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 4000,
    });
  }

  async success_dialog() {
    Swal.fire({
      html: 'msg',
      backdrop: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: 'rgb(34, 34, 34)',
      cancelButtonColor: 'rgb(34, 34, 34)',
    }).then((result) => {
      return result;
    });
  }

  async confirmation_dialog() {
    Swal.fire({
      title: 'Custom width, padding, color, background.',
      width: 600,
      padding: '3em',
      color: '#716add',
      background: '#fff url(/images/trees.png)',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });
  }

  async error_dialog() {
    Swal.fire({
      html: 'msg',
      backdrop: false,
      confirmButtonText: 'Ok',
      confirmButtonColor: 'rgb(34, 34, 34)',
      cancelButtonColor: 'rgb(34, 34, 34)',
    }).then((result) => {
      return result;
    });
  }

  totalDays() {
    var to = localStorage.getItem('toDate');
    var from = localStorage.getItem('fromDate');

    // Two dates to compare
    const date1 = new Date(JSON.stringify(to));
    const date2 = new Date(JSON.stringify(from));

    // Calculate the time difference in milliseconds
    const timeDiff = date2.getTime() - date1.getTime();
    // Calculate the number of days between the two dates
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return diffDays;
  }
}

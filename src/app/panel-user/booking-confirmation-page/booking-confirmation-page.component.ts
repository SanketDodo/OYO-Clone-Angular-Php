import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/service/api-service.service';


@Component({
  selector: 'app-booking-confirmation-page',
  templateUrl: './booking-confirmation-page.component.html',
  styleUrls: ['./booking-confirmation-page.component.scss']
})
export class BookingConfirmationPageComponent implements OnInit {

  bookingData: any = Array();

  constructor(public cookieService: CookieService,
    public ApiServiceService: ApiServiceService) {

  }

  ngOnInit(): void {

    var booking_id = JSON.parse(this.cookieService.get('confirmId'));

    if (booking_id) {
      // console.log('hello->> ', booking_id);
      this.getBooking(booking_id);
    } else {
      console.log('something is wrong!');
    }

  }


  async getBooking(booking_id: any) {

    let formData = new FormData();
    formData.append('id', booking_id);

    this.ApiServiceService.httppostcall(
      'Fetch/get_booking_by_id',
      formData
    ).subscribe((res) => {
      if (res['response_code'] == 1) {
        this.bookingData = res['data'];
      }
    });

  }


}

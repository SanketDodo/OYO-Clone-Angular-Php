import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { BookingDetailsComponent } from '../booking-details/booking-details.component';


@Component({
  selector: 'app-booking-receipt-page',
  templateUrl: './booking-receipt-page.component.html',
  styleUrls: ['./booking-receipt-page.component.scss']
})
export class BookingReceiptPageComponent implements OnInit {


  bookingData: any = Array();

  constructor(public cookieService: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BookingReceiptPageComponent>,
    public ApiServiceService: ApiServiceService) {

    this.getBooking(data.booking_id);
  }

  ngOnInit(): void {

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


  close() {
    this.dialogRef.close({});
  }






}
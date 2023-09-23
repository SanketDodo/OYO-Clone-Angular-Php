import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from 'src/app/service/api-service.service';
import { BookingConfirmationPageComponent } from '../booking-confirmation-page/booking-confirmation-page.component';
import { BookingReceiptPageComponent } from '../booking-receipt-page/booking-receipt-page.component';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})

export class BookingDetailsComponent implements OnInit {

  userId: any;
  displayedColumns: string[] = ['id', 'bookingId', 'Name', 'no_of_rooms', 'check_in', 'check_out', 'action'];
  dataSource: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public ApiServiceService: ApiServiceService,
    public dialog: MatDialog,
    public cookieService: CookieService) {
    this.getLoginCookies();
  }


  ngOnInit() { }

  loadPaginator() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLoginCookies() {
    var cookies = this.cookieService.get('%$#l5%o5%g6%i7%n4%C4%r5%6e%d5%');
    if (cookies) {
      this.userId = JSON.parse(cookies)['id'];
      console.log(this.userId);
      this.getBookingByUserId();
    } else {
      this.ApiServiceService.openSnackBar('Oops! Something went wrong!', '');
    }
  }

  async getBookingByUserId() {

    let formData = new FormData();
    formData.append('userId', this.userId);
    await this.ApiServiceService.httppostcall(
      'Fetch/get_user_bookings_by_id',
      formData
    ).subscribe((res) => {
      // console.log('res->', res);
      if (res['response_code'] == 1) {
        this.dataSource = new MatTableDataSource(res['data']);
        this.loadPaginator();
      } else {
        this.ApiServiceService.openSnackBar(res['msg'], '');
      }
    });
  }

  openDialog(booking_id: any) {

    const dialogRef = this.dialog.open(BookingReceiptPageComponent, {
      data: {
        booking_id: booking_id,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }











}







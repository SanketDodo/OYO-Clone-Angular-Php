import { ApiServiceService } from 'src/app/service/api-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss'],
})
export class BookingPageComponent implements OnInit {
  panelOpenState = false;
  bookingData: any = Array();

  // ! user details
  username: any;
  email: any;
  otp: any;
  mobile_no: any;
  mobile_no_error = false;
  username_error = false;
  email_error = false;
  otp_error = false;
  otp_key: any;

  //! BTN Disabled
  otp_btn_disabled = true;
  signup_btn_disabled = false;
  signIn_btn_disabled = true;

  //! 60 sec timer
  display: any;
  timerInterval: any;

  modify_card = false;

  constructor(
    public ApiServiceService: ApiServiceService,
    public router: Router,
    public cookieService: CookieService
  ) {
    // this.bookThisRoom();
    this.getDataFromCookies();
  }

  ngOnInit(): void {}

  getDataFromCookies() {
    this.ApiServiceService.TOTALROOMS = localStorage.getItem('totalRooms');
    this.ApiServiceService.TOTALGUEST = localStorage.getItem('totalGuests');

    var cookies = this.cookieService.get('bookingData');
    if (cookies) {
      this.bookingData = JSON.parse(cookies);
      // console.log('bookingData cookies', this.bookingData);
    } else {
    }
  }

  async signIn() {
    if (this.mobile_no != undefined) {
      if (this.mobile_no.toString().length == 10) {
        this.mobile_no_error = false;

        // ! pass to sign up form
        let formData = new FormData();
        formData.append('Mobile', this.mobile_no);
        await this.ApiServiceService.httppostcall(
          'Create/generate_otp',
          formData
        ).subscribe((res) => {
          // console.log('res->', res);
          if (res['response_code'] == 1) {
            this.start();
            this.otp_btn_disabled = false;
            this.signup_btn_disabled = true;
            this.signIn_btn_disabled = false;

            if (res['data']) {
              this.username = res['data']['fullname']
                ? res['data']['fullname']
                : '';
              this.email = res['data']['email'] ? res['data']['email'] : '';
              //! remove this after sms integration
              this.otp = res['data']['otp'] ? res['data']['otp'] : '';
            } else {
              // console.log('data not');
              //! remove this after sms integration
              this.otp = res['otp'] ? res['otp'] : '';
              this.username = '';
              this.email = '';
            }
          } else {
            this.stop();
            console.log('there is proble with backend!');
            this.username = '';
            this.email = '';
          }

          if (
            this.username != undefined &&
            this.email != undefined &&
            this.otp != undefined
          ) {
            this.username_error = false;
            this.email_error = false;
          } else {
            if (this.username != undefined) {
              this.username_error = false;
            } else {
              this.username_error = true;
            }
            if (this.email != undefined) {
              this.email_error = false;
            } else {
              this.email_error = true;
            }
            if (this.mobile_no != undefined) {
              this.mobile_no_error = false;
            } else {
              this.mobile_no_error = true;
            }
          }
        });
      } else {
        this.mobile_no_error = true;
      }
    } else {
      this.mobile_no_error = true;
    }
  }

  signUp() {
    if (
      this.username != undefined &&
      this.email != undefined &&
      this.mobile_no != undefined &&
      this.otp != undefined
    ) {
      this.username_error = false;
      this.email_error = false;
      this.mobile_no_error = false;
      this.otp_error = false;

      // ! do execute code
      let formData = new FormData();
      formData.append('Mobile', this.mobile_no);
      formData.append('username', this.username);
      formData.append('email', this.email);
      formData.append('otp', this.otp);
      this.ApiServiceService.httppostcall(
        'Create/verifyotp',
        formData
      ).subscribe((res) => {
        // console.log('res->', res);
        if (res['response_code'] == 1) {
          this.ApiServiceService.setLoginCookies(res['data']);
          this.stop();
        } else {
          this.otp_error = true;
        }
      });
    } else {
      if (this.username != undefined) {
        this.username_error = false;
      } else {
        this.username_error = true;
      }
      if (this.email != undefined) {
        this.email_error = false;
      } else {
        this.email_error = true;
      }
      if (this.mobile_no != undefined) {
        this.mobile_no_error = false;
      } else {
        this.mobile_no_error = true;
      }
      if (this.otp != undefined) {
        this.otp_error = false;
      } else {
        this.otp_error = true;
      }
    }
  }

  resendOtp() {
    if (this.mobile_no.toString().length == 10) {
      this.start();
      // ! pass to sign up form
      let formData = new FormData();
      formData.append('Mobile', this.mobile_no);
      this.ApiServiceService.httppostcall(
        'Create/generate_otp',
        formData
      ).subscribe((res) => {
        if (res['response_code'] == 1) {
          if (res['data']) {
            // ! User exist
            this.username = res['data']['fullname']
              ? res['data']['fullname']
              : '';
            this.email = res['data']['email'] ? res['data']['email'] : '';
            //! remove this after sms integration
            this.otp = res['data']['otp'] ? res['data']['otp'] : '';
          } else {
            //! remove this after sms integration
            this.otp = res['otp'] ? res['otp'] : '';
          }
        }
      });
    }
  }

  start() {
    this.timer(1);
  }

  stop() {
    clearInterval(this.timerInterval);
  }

  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        // console.log('finished', this.display);
        clearInterval(this.timerInterval);
      }
      // console.log('this, this.', this.timerInterval);
    }, 1000);
  }

  modify_user_details() {
    this.modify_card = true;
    this.username = this.ApiServiceService.username;
    this.email = this.ApiServiceService.email;
  }

  cancel_modify() {
    this.modify_card = false;
  }

  modifyDetails() {
    if (this.username != undefined && this.email != undefined) {
      this.username_error = false;
      this.email_error = false;

      // ! do execute code
      let formData = new FormData();
      formData.append('Mobile', this.ApiServiceService.mobile);
      formData.append('username', this.username);
      formData.append('email', this.email);

      this.ApiServiceService.httppostcall(
        'Create/modifyUserDetails',
        formData
      ).subscribe((res) => {
        // console.log('res->', res);
        if (res['response_code'] == 1) {
          this.ApiServiceService.setLoginCookies(res['data']);
          this.modify_card = false;
        }
      });
    } else {
      if (this.username != undefined) {
        this.username_error = false;
      } else {
        this.username_error = true;
      }
      if (this.email != undefined) {
        this.email_error = false;
      } else {
        this.email_error = true;
      }
    }
  }

  bookThisRoom_dialog() {
    Swal.fire({
      title: 'Confirmation!',
      text: 'Do you want to book this room?',
      showCancelButton: true,
      confirmButtonText: 'Book',
      confirmButtonColor: '#1acd2e',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookThisRoom();
      }
    });
  }

  async bookThisRoom() {
    var toDate: any = localStorage.getItem('toDate');
    var fromDate: any = localStorage.getItem('fromDate');

    var cookie = this.cookieService.get('%$#l5%o5%g6%i7%n4%C4%r5%6e%d5%');
    if (cookie) {
      var userLoginData = JSON.parse(cookie);
      let formData = new FormData();
      formData.append('userId', userLoginData.id);
      formData.append('username', userLoginData.username);
      formData.append('mobile', userLoginData.mobile);
      formData.append('email', userLoginData.email);
      formData.append('hotelId', this.bookingData[0].hotel_id);
      formData.append('roomId', this.bookingData[0].room_id);
      formData.append('roomTypeId', this.bookingData[0].room_type_id);
      formData.append('roomType', this.bookingData[0].room_type_name);
      formData.append('packageTypeId', this.bookingData[0].package_id);
      formData.append('packageType', this.bookingData[0].package_name);
      formData.append('totalRooms', this.ApiServiceService.TOTALROOMS);
      formData.append('totalGuests', this.ApiServiceService.TOTALGUEST);
      formData.append('rate', this.bookingData[0].bill_amt);
      formData.append('discount_percent', this.bookingData[0].discount);
      formData.append('discounted_price', this.bookingData[0].discounted_price);
      formData.append('final_bill', this.bookingData[0].total_bill_amt);
      formData.append('check_in', toDate);
      formData.append('check_out', fromDate);

      this.ApiServiceService.httppostcall(
        'Create/bookingHotel',
        formData
      ).subscribe((res) => {
        if (res['response_code'] == 1) {
          Swal.fire('Hurry! Room has been booked!', '', 'success');
          this.router.navigateByUrl('/confirmation');
          this.cookieService.set(
            'confirmId',
            JSON.stringify(res['data']['booking_id'])
          );
        } else {
          Swal.fire(res['msg']);
          // this.ApiServiceService.openSnackBar(res['msg'], '');
        }
      });
    } else {
      console.log('something is wrong!');
    }
  }
}

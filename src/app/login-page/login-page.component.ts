import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiServiceService } from '../service/api-service.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  password_field_hide = false;
  signInForm_hide = false;

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

  //! 60 sec timer
  display: any;
  timerInterval: any;

  constructor(
    public ApiServiceService: ApiServiceService,
    public Router: Router
  ) {

  }

  ngOnInit(): void { }

  async signIn() {
    
    if (this.mobile_no != undefined) {
      if (this.mobile_no.toString().length == 10) {

        this.mobile_no_error = false;
        // ! pass to sign up form
        let formData = new FormData();
        formData.append('Mobile', this.mobile_no);
        await this.ApiServiceService.httppostcall('Create/generate_otp', formData).subscribe((res) => {
          // console.log('res->', res);
          if (res['response_code'] == 1) {
            this.signInForm_hide = true;
            this.start();

            if (res['data']) {
              this.username = (res['data']['fullname']) ? res['data']['fullname'] : '';
              this.email = (res['data']['email']) ? res['data']['email'] : '';
              //! remove this after sms integration
              this.otp = (res['data']['otp']) ? res['data']['otp'] : '';
            } else {
              console.log('data not');
              //! remove this after sms integration
              this.otp = (res['otp']) ? res['otp'] : '';
            }
          } else {
            this.stop();
            console.log('there is proble with backend!');
            
          }
        })
      } else {
        this.mobile_no_error = true;
      }
    } else {
      this.mobile_no_error = true;
    }
  }

  signInPassword() {
    this.password_field_hide = true;
  }

  signInWithoutPassword() {
    this.password_field_hide = false;
  }

  signUp() {
    if (
      this.username != undefined &&
      this.email != undefined &&
      this.otp != undefined
    ) {
      this.username_error = false;
      this.email_error = false;
      this.otp_error = false;

      // ! do execute code
      let formData = new FormData();
      formData.append('Mobile', this.mobile_no);
      formData.append('username', this.username);
      formData.append('email', this.email);
      formData.append('otp', this.otp);
      this.ApiServiceService.httppostcall('Create/verifyotp', formData).subscribe((res) => {
        // console.log('res->', res);
        if (res['response_code'] == 1) {
          this.ApiServiceService.setLoginCookies(res['data']);
          this.Router.navigate(['/welcome-page']);
        } else {
          this.otp_error = true;
        }
      })

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
      this.ApiServiceService.httppostcall('Create/generate_otp', formData).subscribe((res) => {
        if (res['response_code'] == 1) {
          if (res['data']) {
            // ! User exist
            this.username = (res['data']['fullname']) ? res['data']['fullname'] : '';
            this.email = (res['data']['email']) ? res['data']['email'] : '';
            //! remove this after sms integration
            this.otp = (res['data']['otp']) ? res['data']['otp'] : '';
          } else {
            //! remove this after sms integration
            this.otp = (res['otp']) ? res['otp'] : '';
          }
        }
      })
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
    }, 1000);
  }


}

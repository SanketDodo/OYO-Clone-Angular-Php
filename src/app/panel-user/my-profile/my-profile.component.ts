import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  username: any;
  email: any;
  username_error = false;
  email_error = false;
  feilds_disabled = true;

  // ! chnage pass
  hide = true;
  hide2 = true;
  new_pass: any;
  confirm_pass: any;

  new_pass_error = false;
  confirm_pass_error = false;
  not_match_error = false;

  constructor(public ApiServiceService: ApiServiceService) {
    this.username = this.ApiServiceService.username;
    this.email = this.ApiServiceService.email;
  }

  ngOnInit(): void {}

  async modifyDetails() {
    if (this.username != undefined && this.email != undefined) {
      this.username_error = false;
      this.email_error = false;

      // ! do execute code
      let formData = new FormData();
      formData.append('Mobile', this.ApiServiceService.mobile);
      formData.append('username', this.username);
      formData.append('email', this.email);

      await this.ApiServiceService.httppostcall(
        'Create/modifyUserDetails',
        formData
      ).subscribe((res) => {
        // console.log('res->', res);
        if (res['response_code'] == 1) {
          this.ApiServiceService.setLoginCookies(res['data']);
          this.feilds_disabled = true;
          this.ApiServiceService.openSnackBar(res['msg'], '');
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

  edit() {
    this.feilds_disabled = false;
  }

  cancel() {
    this.feilds_disabled = true;
  }

  async updatePassword() {
    if (this.new_pass && this.confirm_pass) {
      this.new_pass_error = false;
      this.confirm_pass_error = false;
      this.not_match_error = false;

      if (this.new_pass == this.confirm_pass) {
        this.not_match_error = false;

        // console.log('if');

        // let formData = new FormData();
        // formData.append('userId', '');
        // formData.append('password', this.confirm_pass);

        // await this.ApiServiceService.httppostcall(
        //   'Create/updatePassword',
        //   formData
        // ).subscribe((res) => {
        //   console.log('res->', res);
        //   if (res['response_code'] == 1) {
        //     this.ApiServiceService.openSnackBar(res['msg'], '');
        //   }
        // });
      } else {
        this.not_match_error = true;
      }
    } else {
      // console.log('else');
      this.new_pass_error = true;
      this.confirm_pass_error = true;
      this.not_match_error = false;
    }
  }
}

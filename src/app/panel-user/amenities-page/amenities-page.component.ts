import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/service/api-service.service';
//! import Swiper core and required modules
import SwiperCore, { SwiperOptions, Autoplay } from 'swiper';
import { AutoplayOptions } from 'swiper/types';
import { EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-amenities-page',
  templateUrl: './amenities-page.component.html',
  styleUrls: ['./amenities-page.component.scss'],
})
export class AmenitiesPageComponent implements OnInit {
  hotel_Id: any;

  roomId: any;
  select_room_type: any;
  select_package_type: any;

  PACKAGES_ARRAY = Array();
  ROOM_TYPE_ARRAY = Array();
  ROOMS_ARRAY = Array();

  AMOUNT = 0;
  DISCOUNT = 0;
  DISCOUNTED_Price = 0;
  TOTAL_AMOUNT = 0;

  hotel_data = Array();
  RoomTypeName: any;
  RoomTypeId: any;
  RoomPackageName: any;
  RoomPackageId: any;

  totalDays: any = 0;

  continueToBook_disabled = true;

  constructor(
    public ApiServiceService: ApiServiceService,
    public cookieService: CookieService,
    public Router: Router
  ) {
    this.hotel_Id = localStorage.getItem('hotelId');
    if (this.hotel_Id) {
      this.getHotelDataByHotelId();
    }
  }

  ngOnInit(): void {
    this.ApiServiceService.dateChnages.subscribe((value) => {
      this.calculateAmount('dummy');
      this.checkAvailablityByDates();
    });
  }

  onSwiper(swiper: any) {
    // console.log(swiper);
  }

  onSlideChange() {
    // console.log('slide change');
  }

  async getHotelDataByHotelId() {
    let formData = new FormData();
    formData.append('hotelId', this.hotel_Id);
    await this.ApiServiceService.httppostcall(
      'Fetch/get_hotel_details_by_id',
      formData
    ).subscribe((res) => {
      // console.log('res->', res);
      if (res['response_code'] == 1) {
        this.hotel_data = res['data'];
        this.getRoomsDataByHotelId();
      } else {
        this.ApiServiceService.openSnackBar(res['msg'], '');
      }
    });
  }

  async getRoomsDataByHotelId() {
    let formData = new FormData();
    formData.append('hotelId', this.hotel_Id);
    formData.append('totalRooms', this.ApiServiceService.TOTALROOMS);
    await this.ApiServiceService.httppostcall(
      'Fetch/get_rooms_by_hotel_id',
      formData
    ).subscribe((res) => {
      // console.log('res->', res);
      if (res['response_code'] == 1) {
        this.ROOMS_ARRAY = res['data'];
        this.getRoomTypes();
        this.continueToBook_disabled = false;
      } else {
        // this.ApiServiceService.openSnackBar(res['msg'], '');
        Swal.fire(res['msg']);
        this.PACKAGES_ARRAY = [];
        this.ROOM_TYPE_ARRAY = [];
        this.ROOMS_ARRAY = [];
        this.AMOUNT = 0;
        this.TOTAL_AMOUNT = 0;
        this.DISCOUNT = 0;
        this.DISCOUNTED_Price = 0;
        this.continueToBook_disabled = true;
      }
    });
  }

  getRoomTypes() {
    this.ROOM_TYPE_ARRAY = [];
    this.ROOMS_ARRAY.reduce((acc, obj) => {
      if (!acc[obj.room_type_id]) {
        acc[obj.room_type_id] = obj;
        this.ROOM_TYPE_ARRAY.push({
          id: obj.room_type_id,
          room_type: obj.room_type,
          frooms_id: obj.frooms_id,
        });
      }
      return acc;
    }, {});

    this.onchangeRoomType(this.ROOM_TYPE_ARRAY[0]['id']);
    var rm = {
      id: this.ROOM_TYPE_ARRAY[0]['id'],
      room_type: this.ROOM_TYPE_ARRAY[0]['room_type'],
      frooms_id: this.ROOM_TYPE_ARRAY[0]['frooms_id'],
    };
    this.setRoomType(rm);
  }

  onchangeRoomType(event: any) {
    // console.log('onchangeRoomType->', event);
    this.select_room_type = event;
    this.PACKAGES_ARRAY = [];
    this.ROOMS_ARRAY.filter((item) => {
      if (item.room_type_id === event) {
        this.PACKAGES_ARRAY.push({
          id: item.package_type_id,
          package_type: item.package,
        });
      }
    });

    this.select_package_type = this.PACKAGES_ARRAY[0]['id'];
    this.onchangePackageType(this.PACKAGES_ARRAY[0]['id']);
    var pkg = {
      id: this.PACKAGES_ARRAY[0]['id'],
      package_type: this.PACKAGES_ARRAY[0]['package_type'],
    };
    this.setPackageType(pkg);
  }

  onchangePackageType(event: any) {
    this.select_package_type = event;
    this.calculateAmount('dummy');
  }

  setRoomType(roomN: any) {
    this.RoomTypeId = roomN.id;
    this.RoomTypeName = roomN.room_type;
    this.roomId = roomN.frooms_id;
    this.checkAvailablityByDates();
  }

  setPackageType(eve: any) {
    this.RoomPackageId = eve.id;
    this.RoomPackageName = eve.package_type;
  }

  calculateAmount(event: any) {
    this.totalDays = this.ApiServiceService.totalDays();

    let RG_Arr = this.ApiServiceService.ROOM_GUEST_ARRAY;
    this.AMOUNT = 0;
    this.ROOMS_ARRAY.filter((item) => {
      if (
        item.room_type_id === this.select_room_type &&
        item.package_type_id === this.select_package_type
      ) {
        this.AMOUNT = item.rate * this.ApiServiceService.TOTALROOMS;
        this.DISCOUNT = item.discount;

        for (let i = 0; i < RG_Arr.length; i++) {
          if (RG_Arr[i]['guests'] > 2) {
            this.AMOUNT += parseInt(item.extra_bed_rate);
          }
        }

        if (this.totalDays > 1 && !Number.isNaN(this.totalDays)) {
          this.AMOUNT *= this.totalDays;
        }
      }
    });

    this.DISCOUNTED_Price = parseInt(
      ((this.DISCOUNT / 100) * this.AMOUNT).toFixed(0)
    );

    this.TOTAL_AMOUNT = this.AMOUNT - this.DISCOUNTED_Price;
  }

  totRooms(event: any) {
    // console.log('totRooms->>call', event);
    this.getRoomsDataByHotelId();
  }

  getChangesFromnavbar(event: any) {
    // ! update rooms and guest from navbar fro prise
    this.calculateAmount(event);
  }

  // async continueToBookdub() {
  //   var BookData = [
  //     {
  //       hotel_id: this.hotel_data[0]['id'],
  //       room_id: this.roomId,
  //       hotel_name: this.hotel_data[0]['hotel_name'],
  //       room_type_id: this.RoomTypeId,
  //       room_type_name: this.RoomTypeName,
  //       package_id: this.RoomPackageId,
  //       package_name: this.RoomPackageName,
  //       address: this.hotel_data[0]['address'],
  //       bill_amt: this.AMOUNT,
  //       total_bill_amt: this.TOTAL_AMOUNT,
  //       discount: this.DISCOUNT,
  //       discounted_price: this.DISCOUNTED_Price,
  //     },
  //   ];

  //   if (BookData) {
  //     this.cookieService.set('bookingData', JSON.stringify(BookData));
  //     // this.Router.navigate(['/booking-page']);
  //   }

  //   //  call to check bookin available or not
  //   let formData = new FormData();
  //   formData.append('hotelId', this.hotel_Id);
  //   formData.append('totalRooms', this.ApiServiceService.TOTALROOMS);
  //   formData.append('roomType', this.RoomTypeName);
  //   formData.append('toDate', this.ApiServiceService.toDate);
  //   formData.append('fromDate', this.ApiServiceService.fromDate);

  //   await this.ApiServiceService.httppostcall(
  //     'Fetch/get_booking_available_or_not',
  //     formData
  //   ).subscribe((res) => {
  //     console.log('res->', res);
  //   });
  // }

  async checkAvailablityByDates() {
    this.continueToBook_disabled = true;
    if (this.ApiServiceService.toDate && this.ApiServiceService.fromDate) {
      console.log('calling from dates', this.ApiServiceService.fromDate);
      //  call to check bookin available or not
      let formData = new FormData();
      formData.append('hotelId', this.hotel_Id);
      formData.append('totalRooms', this.ApiServiceService.TOTALROOMS);
      formData.append('roomType', this.RoomTypeName);
      formData.append('toDate', this.ApiServiceService.toDate);
      formData.append('fromDate', this.ApiServiceService.fromDate);

      await this.ApiServiceService.httppostcall(
        'Fetch/get_booking_available_or_not',
        formData
      ).subscribe((res) => {
        console.log('res->', res);
        if (res['response_code'] == 1) {
          this.continueToBook_disabled = false;
        } else {
          this.continueToBook_disabled = true;
          Swal.fire(res['msg']);
          // this.ApiServiceService.openSnackBar(res['msg'], '');
        }
      });
    }
  }

  async continueToBook() {
    var BookData = [
      {
        hotel_id: this.hotel_data[0]['id'],
        room_id: this.roomId,
        hotel_name: this.hotel_data[0]['hotel_name'],
        room_type_id: this.RoomTypeId,
        room_type_name: this.RoomTypeName,
        package_id: this.RoomPackageId,
        package_name: this.RoomPackageName,
        address: this.hotel_data[0]['address'],
        bill_amt: this.AMOUNT,
        total_bill_amt: this.TOTAL_AMOUNT,
        discount: this.DISCOUNT,
        discounted_price: this.DISCOUNTED_Price,
      },
    ];

    if (BookData) {
      this.cookieService.set('bookingData', JSON.stringify(BookData));
      this.Router.navigate(['/booking-page']);
    }
  }
}

import { ApiServiceService } from './../../service/api-service.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { log } from 'console';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hotel-listing-page',
  templateUrl: './hotel-listing-page.component.html',
  styleUrls: ['./hotel-listing-page.component.scss'],
  providers: [ApiServiceService], // Make sure you have this line
})
export class HotelListingPageComponent implements OnInit {
  load_shimmer = true;
  setLocation: any;

  // ! Price
  value: number = 0;
  highValue: number = 0;
  options: Options = {
    floor: 0,
    ceil: 0,
  };

  select_sortBy = 'Popularity';

  //
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

  hotel_data: any;

  RoomTypeName: any;

  RoomTypeId: any = 0;
  RoomPackageName: any;
  RoomPackageId: any = 0;

  totalDays: any = 0;

  // ! Sample pagignation
  @ViewChild(MatPaginator) paginator: MatPaginator;
  HOTELS_DATA: any;
  DUPLICATE_HOTELS_DATA: any;
  HOTELDATA_OBSER: Observable<any>;

  // ! FOUND FROM LOCATION
  SEARCHED_FOUND: any;

  // ! Filter Box
  HOTEL_FACILITY_ARRAY = Array();
  CHECKED_FACILITY_ARRAY = Array();

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public cookieService: CookieService,
    public datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    public ApiServiceService: ApiServiceService
  ) {
    this.ApiServiceService.LOCATION = localStorage.getItem('location');
    const location = localStorage.getItem('location');
    this.setLocation = location ? location : 'All Locations';
  }

  ngAfterViewInit() {}

  ngOnInit(): void {
    this.getHotelDetails();
  }

  // ! Swiper
  onSwiper(swiper: any) {
    // console.log(swiper);
  }

  onSlideChange() {
    // console.log('slide change');
  }

  loadPaginator() {
    if (this.HOTELS_DATA) {
      this.load_shimmer = false;
      this.HOTELS_DATA.paginator = this.paginator;
      this.HOTELDATA_OBSER = this.HOTELS_DATA.connect();
      this.SEARCHED_FOUND = this.HOTELS_DATA.data.length;
    } else {
      this.load_shimmer = true;
    }
  }

  gettingLocation(event: any) {
    // console.log('from handleMyEvent->>', event);
    this.ApiServiceService.LOCATION = event;
    localStorage.setItem('location', event);
    this.sortbyFacility();
  }

  async getHotelDetails() {
    await this.ApiServiceService.httpcall('Fetch/get_hotels_list').subscribe(
      (res) => {
        // console.log('get_hotels_list res->', res);
        if (res['response_code'] == 1) {
          this.HOTELS_DATA = new MatTableDataSource(res['data']);
          // console.log('calling this func this.HOTELS_DATA', this.HOTELS_DATA);
          this.DUPLICATE_HOTELS_DATA = res['data'];
          this.loadPaginator();

          this.buildHotelFacilityArray();
          this.getMinMaxPrice();
          this.sortbyFacility();
        } else {
          // ! log
          // console.log('data not found');
        }
      }
    );
  }

  onchangeSortBy(event: any) {
    // console.log('called', event);

    if (event == 'LowtoHigh') {
      this.HOTELS_DATA.data.sort(
        (a: { min_rate: number }, b: { min_rate: number }) =>
          a.min_rate - b.min_rate
      );
      this.loadPaginator();
    } else if (event == 'HightoLow') {
      this.HOTELS_DATA.data.sort(
        (a: { min_rate: number }, b: { min_rate: number }) =>
          b.min_rate - a.min_rate
      );
      this.loadPaginator();
    } else {
      this.getHotelDetails();
    }
  }

  openViewDetails(hotelId: any) {
    localStorage.setItem('hotelId', hotelId);
    this.router.navigate(['/view-details']);
  }

  // ! SORT BY PRICE ARRAY & FUNCTIONS

  getMinMaxPrice() {
    // min
    this.HOTELS_DATA.data.sort(
      (a: { min_rate: number }, b: { min_rate: number }) =>
        a.min_rate - b.min_rate
    );
    this.value = this.HOTELS_DATA.data[0]['min_rate'];

    //max
    this.HOTELS_DATA.data.sort(
      (a: { min_rate: number }, b: { min_rate: number }) =>
        b.min_rate - a.min_rate
    );
    this.highValue = this.HOTELS_DATA.data[0]['min_rate'];

    this.options = {
      floor: this.value,
      ceil: this.highValue,
    };

    // console.log('called getMinMaxPrice', this.value);
    this.loadPaginator();
  }

  async onChangesPrice(event: any) {
    this.value = event.value;
    this.highValue = event.highValue;
    await this.sortbyFacility();
  }

  // ! FACILITY FILTER ARRAY & FUNCTIONS

  buildHotelFacilityArray() {
    const element2 = [];
    for (let i = 0; i < this.HOTELS_DATA.data.length; i++) {
      for (let j = 0; j < this.HOTELS_DATA.data[i]['facilities'].length; j++) {
        element2.push(this.HOTELS_DATA.data[i]['facilities'][j]);
      }
    }
    this.HOTEL_FACILITY_ARRAY = element2.filter(
      (item: any, index: any, array: any) => {
        return (
          index ===
          array.findIndex(
            (obj: any) =>
              obj.fhotel_facilities_id === item.fhotel_facilities_id &&
              obj.name === item.name
          )
        );
      }
    );
  }

  getFacilityCheckBoxValue(event: MatCheckboxChange, items: any) {
    // console.log('getFacilityCheckBoxValue->', items);

    if (event.checked === true) {
      this.CHECKED_FACILITY_ARRAY.push(items);
    }

    if (event.checked == false) {
      this.CHECKED_FACILITY_ARRAY = this.CHECKED_FACILITY_ARRAY.filter(
        (item) => item.fhotel_facilities_id != items['fhotel_facilities_id']
      );
    }

    this.sortbyFacility();
  }

  async sortbyFacility() {
    console.log('sortbyFacility->', this.CHECKED_FACILITY_ARRAY);

    let dup_HOTELS_DATA2: any[] = [];

    if (this.CHECKED_FACILITY_ARRAY.length != 0) {
      for (let i = 0; i < this.CHECKED_FACILITY_ARRAY.length; i++) {
        this.DUPLICATE_HOTELS_DATA.filter((item: any) => {
          if (
            item.city.toUpperCase() ===
              this.ApiServiceService.LOCATION.toUpperCase() ||
            this.ApiServiceService.LOCATION.toUpperCase() === 'ALL LOCATIONS'
          ) {
            if (
              parseInt(item.min_rate) >= this.value &&
              parseInt(item.min_rate) <= this.highValue
            ) {
              item.facilities.filter((facilityItem: any) => {
                if (
                  facilityItem.fhotel_facilities_id ===
                  this.CHECKED_FACILITY_ARRAY[i]['fhotel_facilities_id']
                ) {
                  dup_HOTELS_DATA2.push(item);
                }
              });
            }
          }
        });
      }
    } else {
      console.log('iF', this.ApiServiceService.LOCATION.toUpperCase());

      this.DUPLICATE_HOTELS_DATA.filter((item2: any) => {
        if (
          item2.city.toUpperCase() ===
            this.ApiServiceService.LOCATION.toUpperCase() ||
          this.ApiServiceService.LOCATION.toUpperCase() === 'ALL LOCATIONS'
        ) {
          if (
            parseInt(item2.min_rate) >= this.value &&
            parseInt(item2.min_rate) <= this.highValue
          ) {
            dup_HOTELS_DATA2.push(item2);
          }
        }
      });
    }

    let sortedData = dup_HOTELS_DATA2.filter(
      (item: any, index: any, array: any) => {
        return (
          index ===
          array.findIndex(
            (obj: any) => obj.id === item.id && obj.id === item.id
          )
        );
      }
    );

    if (sortedData.length != 0) {
      this.HOTELS_DATA = await new MatTableDataSource(sortedData);
      this.loadPaginator();
    } else {
      this.HOTELS_DATA = await new MatTableDataSource(sortedData);
      this.loadPaginator();
    }
  }

  // ! OPen direct booking

  openBookingPage(detail: any) {
    this.hotel_data = detail;
    // console.log('detail->>>', this.hotel_data);
    this.getRoomsDataByHotelId(detail.id);
  }

  async getRoomsDataByHotelId(hotel_Id: any) {
    let formData = new FormData();
    formData.append('hotelId', hotel_Id);
    formData.append('totalRooms', this.ApiServiceService.TOTALROOMS);
    await this.ApiServiceService.httppostcall(
      'Fetch/get_rooms_by_hotel_id',
      formData
    ).subscribe((res) => {
      // console.log('res->', res);
      if (res['response_code'] == 1) {
        this.ROOMS_ARRAY = res['data'];
        this.getRoomTypes();
      } else {
        this.ApiServiceService.openSnackBar(res['msg'], '');
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

    this.RoomTypeId = this.ROOM_TYPE_ARRAY[0]['id'];
    this.RoomTypeName = this.ROOM_TYPE_ARRAY[0]['room_type'];
    this.roomId = this.ROOM_TYPE_ARRAY[0]['frooms_id'];
    this.onchangeRoomType(this.ROOM_TYPE_ARRAY[0]['id']);
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
    this.RoomPackageId = this.PACKAGES_ARRAY[0]['id'];
    this.RoomPackageName = this.PACKAGES_ARRAY[0]['package_type'];
    this.calculateAmount('book');
  }

  calculateAmount(event: any) {
    // console.log('event->>call', event);
    this.totalDays = this.ApiServiceService.totalDays();
    // console.log('date this.totalDays->>', this.totalDays);

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

    if (event == 'book') {
      this.continueToBook();
    }
  }

  totRooms(event: any) {
    // console.log('totRooms->>call', event);
    this.getRoomsDataByHotelId(this.hotel_data.id);
  }

  getChangesFromnavbar(event: any) {
    // ! update rooms and guest from navbar fro prise
    this.totRooms(event);
  }

  continueToBook() {
    var BookData = [
      {
        hotel_id: this.hotel_data['id'],
        hotel_name: this.hotel_data['hotel_name'],
        address: this.hotel_data['address'],
        room_id: this.roomId,
        room_type_id: this.RoomTypeId,
        room_type_name: this.RoomTypeName,
        package_id: this.RoomPackageId,
        package_name: this.RoomPackageName,
        bill_amt: this.AMOUNT,
        total_bill_amt: this.TOTAL_AMOUNT,
        discount: this.DISCOUNT,
        discounted_price: this.DISCOUNTED_Price,
      },
    ];

    // console.log('hotel_data->>', this.hotel_data);

    if (BookData) {
      this.cookieService.set('bookingData', JSON.stringify(BookData));
      this.router.navigate(['/booking-page']);
    }
  }

  
}

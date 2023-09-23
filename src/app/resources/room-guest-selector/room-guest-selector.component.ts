import { ApiServiceService } from './../../service/api-service.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-room-guest-selector',
  templateUrl: './room-guest-selector.component.html',
  styleUrls: ['./room-guest-selector.component.scss'],
})
export class RoomGuestSelectorComponent implements OnInit {

  @Output() totRooms = new EventEmitter<any>();
  @Output() totGuests = new EventEmitter<any>();

  rooms = 0;
  guests = 2;

  constructor(public ApiServiceService: ApiServiceService) {

    var roomGuestsData = JSON.parse(localStorage.getItem('ROOM_GUEST_ARRAY') || '');
    if (roomGuestsData) {
      this.ApiServiceService.ROOM_GUEST_ARRAY = roomGuestsData;
    }

  }

  ngOnInit(): void {
  }

  addGuests(index: any) {
    this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] =
      this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] > 2
        ? this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests']
        : this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] + 1;
    this.sumAll();
  }

  minusGuests(index: any) {
    this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] =
      this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] < 2
        ? this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests']
        : this.ApiServiceService.ROOM_GUEST_ARRAY[index]['guests'] - 1;
    this.sumAll();
  }

  addRoom() {
    var totRoom = Number(this.ApiServiceService.TOTALROOMS)

    if (this.ApiServiceService.TOTALROOMS <= 4) {
      totRoom += 1;
      this.ApiServiceService.ROOM_GUEST_ARRAY.push({
        rooms: totRoom,
        guests: this.guests,
      });
      this.sumAll();
    }
  }

  delRoom() {
    if (this.ApiServiceService.TOTALROOMS > 1) {
      this.ApiServiceService.TOTALROOMS -= 1;
      this.ApiServiceService.ROOM_GUEST_ARRAY.pop();
      this.sumAll();
    }
  }

  sumAll() {
    this.ApiServiceService.ROOM_GUEST_ARRAY.length;
    let sum = 0;
    this.ApiServiceService.ROOM_GUEST_ARRAY.forEach((e: any) => {
      sum += e.guests;
    });

    this.ApiServiceService.TOTALROOMS = this.ApiServiceService.ROOM_GUEST_ARRAY.length;
    this.ApiServiceService.TOTALGUEST = sum;
    localStorage.setItem('totalRooms', JSON.stringify(this.ApiServiceService.ROOM_GUEST_ARRAY.length));
    localStorage.setItem('totalGuests', JSON.stringify(sum));
    localStorage.setItem('ROOM_GUEST_ARRAY', JSON.stringify(this.ApiServiceService.ROOM_GUEST_ARRAY));

    this.totRooms.emit(this.ApiServiceService.TOTALROOMS);
    this.totGuests.emit(this.ApiServiceService.TOTALGUEST);
  }

}

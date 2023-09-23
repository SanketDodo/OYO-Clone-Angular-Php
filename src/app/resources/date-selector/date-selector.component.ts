import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/service/api-service.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements OnInit {
  
  todaysDate = new Date();
  
  constructor(public ApiServiceService: ApiServiceService) {}

  ngOnInit(): void {
  }

  

}

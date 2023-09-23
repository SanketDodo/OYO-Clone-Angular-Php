import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NavbarComponent } from './panel-user/navbar/navbar.component';
import { HotelListingPageComponent } from './panel-user/hotel-listing-page/hotel-listing-page.component';
import { BookingPageComponent } from './panel-user/booking-page/booking-page.component';
import { BookingConfirmationPageComponent } from './panel-user/booking-confirmation-page/booking-confirmation-page.component';
import { PaymentPageComponent } from './panel-user/payment-page/payment-page.component';
import { AmenitiesPageComponent } from './panel-user/amenities-page/amenities-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './resources/material-modules/app-material.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { SwiperModule } from 'swiper/angular';
import { FooterComponent } from './resources/footer/footer.component';
import { RoomGuestSelectorComponent } from './resources/room-guest-selector/room-guest-selector.component';
import { FormsModule } from '@angular/forms';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { DateSelectorComponent } from './resources/date-selector/date-selector.component';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule, Routes } from '@angular/router';
import { BookingDetailsComponent } from './panel-user/booking-details/booking-details.component';
import { MyProfileComponent } from './panel-user/my-profile/my-profile.component';
import { ListShimmerComponent } from './resources/shimmer/list-shimmer/list-shimmer.component';
import { BookingShimmerComponent } from './resources/shimmer/booking-shimmer/booking-shimmer.component';
import { ViewShimmerComponent } from './resources/shimmer/view-shimmer/view-shimmer.component';
import { BookingReceiptPageComponent } from './panel-user/booking-receipt-page/booking-receipt-page.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    LoginPageComponent,
    NavbarComponent,
    HotelListingPageComponent,
    BookingPageComponent,
    BookingConfirmationPageComponent,
    PaymentPageComponent,
    FooterComponent,
    AmenitiesPageComponent,
    RoomGuestSelectorComponent,
    DateSelectorComponent,
    BookingDetailsComponent,
    MyProfileComponent,
    ListShimmerComponent,
    BookingShimmerComponent,
    ViewShimmerComponent,
    BookingReceiptPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    NgxSliderModule,
    SwiperModule,
    // RouterModule.forRoot(Routes, { useHash: true })
  ],
  providers: [
    DatePipe,
    CookieService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AppModule {}

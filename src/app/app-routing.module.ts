import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AmenitiesPageComponent } from './panel-user/amenities-page/amenities-page.component';
import { BookingConfirmationPageComponent } from './panel-user/booking-confirmation-page/booking-confirmation-page.component';
import { BookingPageComponent } from './panel-user/booking-page/booking-page.component';
import { HotelListingPageComponent } from './panel-user/hotel-listing-page/hotel-listing-page.component';
import { NavbarComponent } from './panel-user/navbar/navbar.component';
import { PaymentPageComponent } from './panel-user/payment-page/payment-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { BookingDetailsComponent } from './panel-user/booking-details/booking-details.component';
import { MyProfileComponent } from './panel-user/my-profile/my-profile.component';

const routes: Routes = [
  // { path: '', component: AmenitiesPageComponent },
  { path: '', component: WelcomePageComponent },
  { path: 'welcome-page', component: WelcomePageComponent },
  { path: 'login-page', component: LoginPageComponent },
  { path: 'hotel-details', component: HotelListingPageComponent },
  { path: 'booking-page', component: BookingPageComponent },
  { path: 'view-details', component: AmenitiesPageComponent },
  { path: 'confirmation', component: BookingConfirmationPageComponent },
  { path: 'profile', component: MyProfileComponent },
  { path: 'booking-history', component: BookingDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

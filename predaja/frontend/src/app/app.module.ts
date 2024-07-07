import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminloginComponent } from './adminLogin/adminlogin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AdminComponent } from './admin/admin.component';
import { WaiterComponent } from './waiter/waiter.component';
import { AddWaiterComponent } from './add-waiter/add-waiter.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { AdminGuestListComponent } from './admin-guest-list/admin-guest-list.component';
import { AdminEditGuestComponent } from './admin-edit-guest/admin-edit-guest.component';
import { ShowRestaurantComponent } from './show-restaurant/show-restaurant.component';
import { WaiterReservationsComponent } from './waiter-reservations/waiter-reservations.component';
import { AcceptReservationComponent } from './accept-reservation/accept-reservation.component';
import { GuestReservationsComponent } from './guest-reservations/guest-reservations.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { GuestOrdersComponent } from './guest-orders/guest-orders.component';
import { WaiterDeliveryComponent } from './waiter-delivery/waiter-delivery.component';
import { WaiterStatsComponent } from './waiter-stats/waiter-stats.component'
import { Chart } from 'chart.js';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AdminloginComponent,
    ChangePasswordComponent,
    NavbarComponent,
    HomeComponent,
    ProfileComponent,
    ProfileEditComponent,
    AdminComponent,
    WaiterComponent,
    AddWaiterComponent,
    AddRestaurantComponent,
    AdminGuestListComponent,
    AdminEditGuestComponent,
    ShowRestaurantComponent,
    WaiterReservationsComponent,
    AcceptReservationComponent,
    GuestReservationsComponent,
    RestaurantMenuComponent,
    GuestOrdersComponent,
    WaiterDeliveryComponent,
    WaiterStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

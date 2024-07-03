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
import { AdminGuestListComponent } from './admin-guest-list/admin-guest-list.component'

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
    AdminGuestListComponent
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

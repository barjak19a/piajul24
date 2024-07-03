import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminloginComponent } from './adminLogin/adminlogin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AdminComponent } from './admin/admin.component';
import { WaiterComponent } from './waiter/waiter.component';
import { AddWaiterComponent } from './add-waiter/add-waiter.component';
import { AddRestaurantComponent } from './add-restaurant/add-restaurant.component';
import { AdminGuestListComponent } from './admin-guest-list/admin-guest-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'adminlogin', component: AdminloginComponent},
  { path: 'change-password', component: ChangePasswordComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'profile-edit', component: ProfileEditComponent},
  { path: 'pending-guests', component: AdminComponent},
  { path: 'waiter', component: WaiterComponent},
  { path: 'add-waiter', component: AddWaiterComponent},
  { path: 'add-restaurant', component: AddRestaurantComponent},
  { path: 'admin-guest-list', component: AdminGuestListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

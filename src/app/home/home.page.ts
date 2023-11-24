import { Component } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {IUser} from "../interfaces/i-user";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  standardUsers: IUser[] = [];
  user: IUser;
  constructor(private userService: UserService, private localStorageService: LocalStorageService, private router: Router) {
    this.getUsers();
    this.localStorageService.getUser().then((user) => {
      this.user = user;
    });
  }


  getUsers() {
    this.userService.getStandardUsers().then((value) => {
      this.standardUsers = value;
    })
  }

  showProfile(user: IUser) {
    this.router.navigate(['/profile'], {
      queryParams: {
        user: JSON.stringify(user),
        me: JSON.stringify(this.user)
      }
    });
  }
}

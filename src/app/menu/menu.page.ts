import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user/user.service";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {IUser} from "../interfaces/i-user";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  user: IUser;

  constructor(private userService: UserService, private localStorage: LocalStorageService) {
    this.localStorage.getUser().then((user) => this.user = user);
  }

  ngOnInit() {
  }

  logout() {
    return this.userService.signOut();
  }
}

import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {UserCollectionService} from "../../../services/user/user-collection.service";
import {IUser} from "../../../interfaces/i-user";
import {LocalStorageService} from "../../../_shared/services/local-storage.service";
import {UserService} from "../../../services/user/user.service";
import {AbstractBase} from "../../../_shared/classes/AbstractBase";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent extends AbstractBase implements OnInit {

  @Input() userIds: string[] = [];
  @Input() orderBy: string = 'username';
  @Input() direction: 'asc' | 'desc' = 'asc';
  @Input() type: string;
  loading: boolean = true;
  users: IUser[] = [];
  user: IUser;
  constructor(private userCollectionService: UserCollectionService, protected localStorage: LocalStorageService,
              private userService: UserService, protected navCtrl: NavController, protected changeDetector: ChangeDetectorRef) {
    super(localStorage, navCtrl, changeDetector);

    this.userCallBack = () => {
      if (this.user._friendsList) {
        this.users = this.users.filter((user) => this.user._friendsList.includes(user.id))
      } else {
        this.users = [];
      }
    }
  }

  ngOnInit() {
    this.getUsers();

    this.userCallBack = () => {
      let temp;

      if (this.type === 'requests') {
        temp = this.user._friendRequests || [];
      } else if (this.type === 'sent') {
        temp = this.user._sentFriendRequests || [];
      } else if (this.type === 'friends') {
        temp = this.user._friendsList || [];
      }

      if (temp.length !== this.userIds) {
        this.getUsers();
      }

      this.userIds = temp;
      this.users = [];
      this.changeDetector.detectChanges();
    }
  }

  getUsers(offset?: string) {
    this.loading = true;

    if (this.userIds && this.userIds.length > 0) {
      this.userCollectionService.getAll(20, offset, [{key: 'id', opr: 'in', value: this.userIds}], this.orderBy)
        .then((users) => {
          this.users = this.users.concat(users);
          this.loading = false;
        });
    } else {
      this.users = [];
      this.loading = false;
    }
  }

  showProfile(user:IUser) {
    this.userService.showProfile(user, this.user);
  }
}

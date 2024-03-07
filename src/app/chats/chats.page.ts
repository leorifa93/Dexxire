import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChatsCollectionService} from "./services/chats-collection.service";
import {CollectionService} from "../services/collection.service";
import {AbstractBase} from "../_shared/classes/AbstractBase";
import {LocalStorageService} from "../_shared/services/local-storage.service";
import {NavController} from "@ionic/angular";
import {IMessages} from "./interfaces/i-messages";
import {Router} from "@angular/router";
import algoliasearch, {SearchClient, SearchIndex} from "algoliasearch";
import {IUser} from "../interfaces/i-user";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage extends AbstractBase implements OnInit {

  chats: IMessages[] = [];
  loading: boolean = true;
  client: SearchClient;
  index: SearchIndex;
  searchString: string;
  searchedFriends: IUser[] = [];
  maxPages: number = 0;
  currentPage: number = 0;
  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef, private chatsCollectionService: ChatsCollectionService,
              private router: Router) {
    super(localStorage, navCtrl, changeDetector)
  }

  ngOnInit() {
    this.afterUserLoaded = () => {
      this.client = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);
      this.index = this.client.initIndex('dexxire');
      const searchableAttributes = [
        'id',
        'username',
        'location.location',
      ];

      this.index.setSettings({
        customRanking: ['asc(username)'],
        searchableAttributes: searchableAttributes
      });
      this.getAllChats();
    }
  }

  onSearch() {
    this.searchedFriends = [];

    this.search(0);
  }

  private search(page: number) {
    let filter = '';

    for (let userId of this.user._friendsList) {
      filter += '(ObjectID:' + userId + ')';
    }


    this.index.search(this.searchString, {
      //page: page,
      filters: filter
    }).then((data: any) => {
      var resultUsers = [];

      console.log(data.hits);
      for (let user of data.hits) {
        if (this.user.genderLookingFor.includes(user.gender) && user.genderLookingFor.includes(this.user.gender)) {
          resultUsers.push(user);
        }
      }

      this.searchedFriends = this.searchedFriends.concat(resultUsers);
      this.maxPages = data.nBPages;
      this.currentPage = data.page;
    });

    //this.keyBoardService.closeKeyBoard();
  }

  getAllChats() {
    this.loading = true;

    this.chatsCollectionService.getAll(10, null,
      [{key: 'memberIds', opr: 'array-contains', value: this.user.id}],
      [{key: 'lastMessageAt', descending: 'desc'}], null, true, (snapshot) => {
        this.chats = CollectionService.getSnapshotDataFromCollection(this.chats, snapshot, 'id', null, null, 'desc');
        this.sort();
        this.loading = false;
      });
  }

  getOtherProfile(chat: IMessages) {
    return chat.profiles.filter((user) => user.id !== this.user.id)[0];
  }

  sort() {
    this.chats = this.chats.sort((a, b) => {
      return a.lastMessageAt < b.lastMessageAt ? 1 : -1;
    })
  }

  deleteChat(chatId: string) {
    return this.chatsCollectionService.remove(chatId);
  }
  openChat(chat: IMessages, userId) {
    if (!chat.seen.includes(this.user.id)) {
      chat.seen.push(this.user.id);
      this.chatsCollectionService.set(chat.id, chat);
    }

    return this.router.navigate(['/chat/' + userId]);
  }
}

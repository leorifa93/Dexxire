import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AbstractBase} from "../../_shared/classes/AbstractBase";
import {LocalStorageService} from "../../_shared/services/local-storage.service";
import {ActionSheetController, NavController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatsCollectionService} from "../services/chats-collection.service";
import {IMessages} from "../interfaces/i-messages";
import {IMessage} from "../interfaces/i-message";
import {IUser} from "../../interfaces/i-user";
import {UserCollectionService} from "../../services/user/user-collection.service";
import {CollectionService} from "../../services/collection.service";
import {TranslateService} from "@ngx-translate/core";
import {CameraService} from "../../_shared/services/camera.service";
import {UploadService} from "../../_shared/services/upload.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage extends AbstractBase implements OnInit {

  @ViewChild('content') private content: any;
  otherUserId: string;
  otherUser: IUser;
  chatId: string;
  chat: IMessages;
  loading: boolean = true;

  messages: IMessage[] = [];
  textInput: string = '';
  init: boolean = false;
  initMessenger: boolean = false;

  chatSubscriber: any;
  messageSubscriber: any;
  lastDoc: any;
  attachedImg: string[] = [];
  isUploadingImg: boolean = false;

  constructor(protected localStorage: LocalStorageService, protected navCtrl: NavController,
              protected changeDetector: ChangeDetectorRef, private route: ActivatedRoute,
              private chatsCollectionService: ChatsCollectionService, private userCollectionService: UserCollectionService,
              private actionSheetCtrl: ActionSheetController, private translateService: TranslateService,
              private cameraService: CameraService, private uploadService: UploadService, private router: Router) {
    super(localStorage, navCtrl, changeDetector);

    this.afterUserLoaded = () => {
      this.initChat();
    }
  }

  ngOnInit() {
    this.otherUserId = this.route.snapshot.paramMap.get('userId');
    this.userCollectionService.get(this.otherUserId).then((user) => this.otherUser = user);
  }

  initChat() {
    let filter = [];

    [this.user.id, this.otherUserId].forEach((id) => {
      filter.push({key: `members.${id}`, opr: '==', value: true})
    })

    this.chatSubscriber = this.chatsCollectionService.getAll(1, null, filter, null, null, true, (snapshot) => {
        this.chat = CollectionService.getSnapshotDataFromCollection([], snapshot)[0];

        if (this.chat && this.chat.id) {
          if (!this.initMessenger) {
            this.getMessages();
            this.initMessenger = true;
          }

          if (!this.chat.seen.includes(this.user.id)) {
            this.chat.seen.push(this.user.id);
            this.chatsCollectionService.set(this.chat.id, this.chat);
          }
        }

        this.loading = false;
      }, null, false);
  }

  private createChat(message: IMessage, optionalMessage?: string) {
    this.chat = {
      lastMessage: optionalMessage || message.lastMessage,
      lastMessageAt: message.sentAt,
      lastMessageFrom: message.lastMessageFromId,
      memberIds: [this.user.id, this.otherUserId],
      profiles: [
        {id: this.user.id, username: this.user.username, profilePictures: this.user.profilePictures},
        {id: this.otherUser.id, username: this.otherUser.username, profilePictures: this.otherUser.profilePictures}
      ],
      createdAt: message.sentAt,
      seen: [this.user.id]
    };
    this.chat.members = {};
    this.chat.members[this.user.id] = true;
    this.chat.members[this.otherUserId] = true;

    return this.chatsCollectionService.add(this.chat).then((doc) => {
      this.chat.id = doc.id;
      return this.chatsCollectionService.set(this.chat.id, this.chat);
    });
  }

  async sendMessage() {
    const now = Date.now();
    const message: IMessage = {
      lastMessage: this.textInput || '',
      lastMessageFromId: this.user.id,
      sentAt: now,
      type: 'text'
    }

    if (this.attachedImg.length > 0) {
      this.isUploadingImg = true;
      message.type = 'image';
    }

    this.textInput = '';

    if (!this.chat) {
      await this.createChat(message, message.type === 'image' ? this.translateService.instant('IMAGEATTACHED') : message.lastMessage);
    } else {
      this.chat.seen = [this.user.id];
      this.chat.lastMessageAt = now;
      this.chat.lastMessage = message.lastMessage;
      this.chat.lastMessageFrom = message.lastMessageFromId;
    }

    if (message.type === 'image') {
      const messageInput = message.lastMessage;
      const cloneAttachedIms = Object.assign([], this.attachedImg);
      this.chat.lastMessage = this.translateService.instant('IMAGEATTACHED');

      let index = 1 ;

      for (let img of cloneAttachedIms) {
        if (index === cloneAttachedIms.length) {
          message.lastMessage = null;
        } else {
          message.lastMessage = messageInput;
        }

        const id = this.chatsCollectionService.createId(null, [this.chat.id, 'Messages']);
        message.picture = await this.uploadService.uploadFile(img, this.chat.id +'/'+ id + '/image');

        await this.chatsCollectionService.set(this.chat.id, message, null, ['Messages', id]);
        this.removeImgAttachement(img);

        index++;
      }

      this.chatsCollectionService.set(this.chat.id, this.chat);
    } else {
      this.chatsCollectionService.set(this.chat.id, this.chat)
        .then(async () => {
          return this.chatsCollectionService.add(message, null, [this.chat.id, 'Messages']);
        });
    }
  }

  private getMessages() {
    this.messageSubscriber = this.chatsCollectionService.getAll(10, null, null,
      [{key: 'sentAt', descending: 'desc'}], null, true, (snapshot) => {
        this.messages = CollectionService.getSnapshotDataFromCollection(this.messages, snapshot, 'id', {
          added: (doc) => {
            this.lastDoc = doc.docData;
          }
        }, null, 'asc');


        if (!this.init) {
          this.messages = this.messages.reverse();
          this.init = true;
        }

        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 500)
      }, [this.chat.id, 'Messages']);
  }

  ngOnDestroy() {
    if (this.chatSubscriber) {
      this.chatSubscriber();
    }

    if (this.messageSubscriber) {
      this.messageSubscriber();
    }
  }

  async loadOldMessages(event, direction: 'top' | 'bottom') {

    if (direction == 'top' && this.lastDoc) {
      this.chatsCollectionService.getAll(10, this.lastDoc.sentAt, null,
        [{key: 'sentAt', descending: 'desc'}], null, null, null, [this.chat.id, 'Messages'])
        .then((data) => {
          this.lastDoc = data[data.length - 1];

          setTimeout(() => {
            this.messages.unshift(...data);
            event.target.complete();
          }, 1000);
        })
    }

  }

  async showOptions() {
    const sheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translateService.instant('ATTACHEIMAGE'),
          icon: 'image-outline',
          handler: () => {
            this.cameraService.getPictures(5).subscribe(base64 => {
              if (base64) {
                this.attachedImg.push(base64);
              }
            })
          }
        }
      ]
    });

    return sheet.present();
  }

  removeImgAttachement(base64: string) {
    this.attachedImg = this.attachedImg.filter(img => img !== base64);
  }

  showImg(img: string) {
    return this.cameraService.showImages([
      {
        url: img,
      }
    ])
  }

  showProfile(user: IUser) {
    this.router.navigate(['/profile/' + user.id]);
  }
}

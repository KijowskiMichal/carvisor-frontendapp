import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {UserInfo, UserService} from "../services/user.service";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private routeSub!: Subscription;
  private id!:number;
  userInfo!: UserInfo;
  constructor(private userService: UserService, private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.userService.getUserInfo(this.id).subscribe(value => {
        this.userInfo = value;
      });
    });
  }

  sendData(nameInput:HTMLInputElement, phoneInput:HTMLInputElement) {
    var name = nameInput.value;
    var phone = phoneInput.value;
    var allClear = true;
    nameInput.classList.remove('error');
    phoneInput.classList.remove('error');
    //validator
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,12} [A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,18}$/.test(name)) {
      nameInput.focus();
      nameInput.classList.add('error');
      nameInput.value = "";
      nameInput.placeholder = "Tylko litery, dwa człony, od 2 do 30 znaków.";
      allClear = false;
    }
    if (!/^[0-9]{9}$/.test(phone)) {
      phoneInput.focus();
      phoneInput.classList.add('error');
      phoneInput.value = "";
      phoneInput.placeholder = "9 cyfr bez spacji i znaków specjalnych.";
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.userService.putUserInfo(this.id, name, phone).subscribe(
        () => {
        },
        () => {
          this.popupFail = true;
        },
        () => {
          this.popupOk = true;
        });
  }

  onFileChanged(evt: Event) {
    if ((<HTMLInputElement>evt.target).files) {
      const file = (<HTMLInputElement>evt.target).files?.item(0);
      if (!file) {
        return false;
      }
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var maxW = 400;
      var maxH = 400;
      var img = document.createElement('img');
      var selff = this;
      img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context?.drawImage(img, 0, 0, iwScaled, ihScaled);
        selff.userService.putUserImage(selff.id, canvas).subscribe(
            () => {
            },
            () => {
              selff.popupFail = true;
            },
            () => {
              selff.popupOk = true;
            });
      }
      img.src = URL.createObjectURL(file);
    }
  }
}

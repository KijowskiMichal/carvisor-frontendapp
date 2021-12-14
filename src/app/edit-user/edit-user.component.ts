import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
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
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  popupText = "Pomyślnie zaktualizowano.";
  popupReset = false;
  popupOk = false;
  popupFail = false;
  popupDelete = false;
  complete!: boolean;

  ngOnInit(): void {
    this.complete = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.userService.getUserInfo(this.id).subscribe(value => {
        this.userInfo = value;
      },
      () => {
        this.complete = true;
      },
      () => {
        this.complete = true;
      });
    });
  }

  sendData(nameInput:HTMLInputElement, phoneInput:HTMLInputElement) {
    let name = nameInput.value;
    let phone = phoneInput.value;
    let allClear = true;
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
          this.popupText = "Pomyślnie zaktualizowano użytkownika.";
          this.popupOk = true;
        });
  }

  onFileChanged(evt: Event) {
    if ((<HTMLInputElement>evt.target).files) {
      const file = (<HTMLInputElement>evt.target).files?.item(0);
      if (!file) {
        return false;
      }
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      let maxW = 400;
      let maxH = 400;
      let img = document.createElement('img');
      let selff = this;
      img.onload = function () {
        let iw = img.width;
        let ih = img.height;
        let scale = Math.max((maxW / iw), (maxH / ih));
        let iwScaled = iw * scale;
        let ihScaled = ih * scale;
        let minSize = Math.min(iwScaled, ihScaled);
        canvas.width = minSize;
        canvas.height = minSize;
        context?.rect(0, 0, minSize, minSize);
        context?.stroke();
        context?.clip();
        context?.drawImage(img, 0, 0, iwScaled, ihScaled);
        selff.userService.putUserImage(selff.id, canvas).subscribe(
            () => {
            },
            () => {
              selff.popupFail = true;
            },
            () => {
              selff.popupText = "Pomyślnie zaktualizowano zdjęcie.";
              selff.popupOk = true;
            });
      }
      img.src = URL.createObjectURL(file);
    }
  }

  deleteUser() {
    this.popupDelete = false;
    this.userService.deleteUser(this.id).subscribe(
    () => {
      },
      () => {
        this.popupFail = true;
      },
      () => {
        this.popupText = "Pomyślnie usunięto użytkownika.";
        this.popupOk = true;
      });
  }

  resetPassword() {
    let newPasswd = (Math.random() + 1).toString(36).substring(3);
    this.popupReset = false;
    this.userService.changePasswordOfUser(this.id, newPasswd, newPasswd).subscribe(
      () => {
      },
      () => {
        this.popupFail = true;
      },
      () => {
        this.popupText = "Nowo wygenerowane hasło: " + newPasswd;
        this.popupOk = true;
      });
  }
}

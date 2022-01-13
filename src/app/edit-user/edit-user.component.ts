import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UserInfo, UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ZoneService, Zones} from "../services/zone.service";
import { PageService } from '../services/page.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private routeSub!: Subscription;
  private id!:number;
  userInfo!: UserInfo;
  constructor(private userService: UserService, private zoneService: ZoneService, private route: ActivatedRoute, private pageService: PageService) { }

  popupText = "Pomyślnie zaktualizowano.";
  errorPopupText = "Wystąpił błąd.";
  popupReset = false;
  popupOk = false;
  popupFail = false;
  popupDelete = false;
  complete!: boolean;

  searchZones: string;
  zonesList: Zones[];
  zonesInfo: Zones[];

  selectedZones: Set<number> = new Set<number>();

  checkbox!: boolean;

  ngOnInit(): void {
    this.complete = false;
    this.zoneService.getZones("$").subscribe(value => {
      this.zonesList = value;
    });
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
      this.zoneService.getUserZones(this.id).subscribe(value => {
        this.zonesInfo = value;
        this.zonesInfo.forEach((zone) => {
          this.selectedZones.add(zone.id);
        });
      });
    });
  }

  shouldBeChecked(): boolean {
    this.zonesList.forEach((zone) => {
      if (!this.selectedZones.has(zone.id)) {
        return true;
      }
    })
    return false;
  }

  changeSearch() {
    this.zoneService.getZones(this.searchZones === "" ? "$" : this.searchZones).subscribe((value) => {
      this.zonesList = value;
      this.checkbox = this.shouldBeChecked();
    });
  }

  changeStateOfZone(id: number) {
    if (this.selectedZones.has(id)) {
      this.selectedZones.delete(id);
    }
    else {
      this.selectedZones.add(id);
    }
    this.checkbox = this.shouldBeChecked();
  }

  selectAll() {
    if (this.checkbox) {
      this.zonesList.forEach((zone) => {
        this.selectedZones.add(zone.id);
      })
    }
    else {
      this.selectedZones.clear();
    }
  }

  sendData(nameInput:HTMLInputElement, phoneInput:HTMLInputElement, permissionInput:HTMLSelectElement) {
    let name = nameInput.value;
    let phone = phoneInput.value;
    let permission = permissionInput.value;
    let allClear = true;
    nameInput.classList.remove('error');
    phoneInput.classList.remove('error');
    permissionInput.classList.remove('error');
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
    if ((this.pageService.loginStatus.rbac === 'MODERATOR') && (permission === 'ADMINISTRATOR')) {
      permissionInput.focus();
      permissionInput.classList.add('error');
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.zoneService.assignZones(Array.from(this.selectedZones), this.id).subscribe(() => {});
    this.userService.putUserInfo(this.id, name, phone, permission).subscribe(
        () => {
        },
        () => {
          this.errorPopupText = "Wystąpił błąd.";
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
              selff.errorPopupText = "Wystąpił błąd.";
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
      (error: HttpErrorResponse) => {
        if (error.status === 406) {
          this.errorPopupText = "Nie można usunąć administratora ani aktualnie zalogowanego użytkownika.";
        }
        else {
          this.errorPopupText = "Wystąpił błąd.";
        }
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
        this.errorPopupText = "Wystąpił błąd.";
        this.popupFail = true;
      },
      () => {
        this.popupText = "Nowo wygenerowane hasło: " + newPasswd;
        this.popupOk = true;
      });
  }
}

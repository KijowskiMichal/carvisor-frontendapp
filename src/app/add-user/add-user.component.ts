import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from "../services/user.service";
import {PageService} from "../services/page.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  photo = '';
  popupOk = false;
  popupFail = false;

  constructor(public userService: UserService, private pageService: PageService, private router: Router) {}

  ngOnInit(): void {
    this.pageService.getLoginStatus().subscribe(value => {
      if (!value.logged) {
        this.router.navigate(['./']);
      }
    });
  }

  closeWindow()
  {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
  }


  onFileChanged(evt: Event, imagePreview: HTMLDivElement) {
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
      var that = this;
      img.onload = function() {
        var iw = img.width;
        var ih = img.height;
        var scale = Math.min((maxW / iw), (maxH / ih));
        var iwScaled = iw * scale;
        var ihScaled = ih * scale;
        canvas.width = iwScaled;
        canvas.height = ihScaled;
        context?.drawImage(img, 0, 0, iwScaled, ihScaled);
        that.photo = canvas.toDataURL();
        imagePreview.style.backgroundImage = 'url(' + that.photo + ')';
      }
      img.src = URL.createObjectURL(file);
    }
  }

  sendForm(nameAndSurname:HTMLInputElement, phone:HTMLInputElement, login:HTMLInputElement, password1:HTMLInputElement, password2:HTMLInputElement) {
    var nameValue = nameAndSurname.value.split(' ')[0];
    var surnameValue = nameAndSurname.value.split(' ')[1];
    var phoneValue = phone.value;
    var loginValue = login.value;
    var password1Value = password1.value;
    var password2Value = password2.value;
    var allClear = true;
    nameAndSurname.classList.remove('error');
    phone.classList.remove('error');
    login.classList.remove('error');
    password1.classList.remove('error');
    password2.classList.remove('error');
    //validator
    if (!/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,12} [A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{2,18}$/.test(nameAndSurname.value)) {
      nameAndSurname.focus();
      nameAndSurname.classList.add('error');
      nameAndSurname.value = "";
      nameAndSurname.placeholder = "Tylko litery, dwa człony, od 2 do 30 znaków.";
      allClear = false;
    }
    if (!/^[0-9]{9}$/.test(phoneValue)) {
      phone.focus();
      phone.classList.add('error');
      phone.value = "";
      phone.placeholder = "9 cyfr bez spacji i znaków specjalnych.";
      allClear = false;
    }
    if (!/^[A-Za-z0-9]{2,20}$/.test(loginValue)) {
      login.focus();
      login.classList.add('error');
      login.value = "";
      login.placeholder = "Od 2 do 20 znaków, tylko litery i cyfry.";
      allClear = false;
    }
    if (!/^.{5,30}$/.test(password1Value) || !(password1Value === password2Value)) {
      password1.focus();
      password1.classList.add('error');
      password2.classList.add('error');
      password1.value = "";
      password2.value = "";
      password1.placeholder = "Hasła muszą być zgodne";
      password2.placeholder = "i mieć długość od 5 do 30 znaków";
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.userService.postNewUser(this.photo, nameValue, surnameValue, loginValue, Number(phoneValue), password1Value).subscribe(
        () => {
        },
        () => {
          this.closeWindow();
          this.popupFail = true;
        },
        () => {
          this.closeWindow();
          this.popupOk = true;
        });

  }
}

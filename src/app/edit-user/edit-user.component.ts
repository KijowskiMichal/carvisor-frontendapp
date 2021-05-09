import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

interface UserInfo {
  userPrivileges: number;
  name: string;
  telephone: number;
  image: string;
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  private routeSub: Subscription;
  private id:number;
  userInfo: UserInfo;
  private picture: string;
  private selectedFile: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  popupOk = false;
  popupFail = false;

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.http.get<UserInfo>('/API/users/getUserData/' + this.id + '/').subscribe(value => {
        this.userInfo = value;
      });
    });
  }

  sendData(name:string, phone:string) {
    this.http.post('/API/users/changeUserData/' + this.id + '/',
      {
        "name": name,
        "telephone": phone
      })
      .subscribe(
        (val) => {
        },
        response => {
          this.popupFail = true;
        },
        () => {
          this.popupOk = true;
        });
  }

  onFileChanged(evt: Event) {
    const file = (<HTMLInputElement>evt.target).files[0];
    if (!file) {
      return false;
    }
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var maxW = 400;
    var maxH = 400;
    var img = document.createElement('img');
    var selff = this;
    img.onload = function() {
      var iw = img.width;
      var ih = img.height;
      var scale = Math.min((maxW / iw), (maxH / ih));
      var iwScaled = iw * scale;
      var ihScaled = ih * scale;
      canvas.width = iwScaled;
      canvas.height = ihScaled;
      context.drawImage(img, 0, 0, iwScaled, ihScaled);
      selff.http.post('/API/users/changeUserData/' + selff.id + '/',
        {
          "image": canvas.toDataURL()
        })
        .subscribe(
          (val) => {
          },
          response => {
            selff.popupFail = true;
          },
          () => {
            selff.popupOk = true;
          });
    }
    img.src = URL.createObjectURL(file);
  }
}

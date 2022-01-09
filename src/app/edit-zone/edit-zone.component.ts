import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ZoneDesc, ZoneService} from "../services/zone.service";
import {listNames, Rate} from "../services/map.service";
declare var ol: any;

@Component({
  selector: 'app-edit-zone',
  templateUrl: './edit-zone.component.html',
  styleUrls: ['./edit-zone.component.scss']
})
export class EditZoneComponent implements OnInit {

  private map!: any;

  popup = false;
  @Input()
  set popupFlag(value) {
    if (value === true) {
      this.zoneService.getZone(this.zoneId).subscribe(value => {
        this.popup = true;
        this.zoneInfo = value;
        this.posX = this.zoneInfo.pointX;
        this.posY = this.zoneInfo.pointY;
        this.zoneName = this.zoneInfo.name;
        this.radiusValue = this.zoneInfo.radius.toString();
        this.popupOn = false;
      });
      setTimeout(() => {
        this.drawCircle(this.posY, this.posX);
        this.map.getView().setCenter(ol.proj.fromLonLat([Number.parseFloat(this.posY), Number.parseFloat(this.posX)]));

      }, 500);
    }
    else {
      this.popup = false;
    }
  }
  @Input() zoneId = 0;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;

  popupOk = false;
  popupFail = false;
  popupOn = false;
  latitude: number = 52.460394146699365;
  longitude: number = 16.917809968543395;
  rates!: Rate;
  names!: listNames[];
  points: Array<any> = [];
  empList: Array<any> = [];
  line: Array<any> = [];
  dateValue!:string;
  radiusValue: string = '1000';
  circle: any;
  zoneName: string;
  posY: string;
  posX: string;
  zoneInfo: ZoneDesc;
  popupTrigger!: HTMLDivElement;

  constructor(public zoneService: ZoneService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 14
      })
    });
    this.map.setTarget(this.mapElementRef.nativeElement);
    this.map.on('click', function(evt) {
      var click = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.drawCircle(click[0], click[1]);
      this.posY = click[0];
      this.posX = click[1];
    }, this);
  }

  showPopup() {
    this.popupOn = true;
    this.popupTrigger.classList.add("popupOpen");
  }

  disablePopup() {
    this.popupTrigger.classList.remove("popupOpen");
    this.popupOn = false;
  }

  drawCircle(posY, posX) {
    this.map.removeLayer(this.circle);
    var centerLongitudeLatitude = ol.proj.fromLonLat([Number.parseFloat(posY), Number.parseFloat(posX)]);
    this.circle = new ol.layer.Vector({
      source: new ol.source.Vector({
        projection: 'EPSG:4326',
        features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, Number.parseInt(this.radiusValue) * 2))]
      }),
      style: [
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        })
      ]
    });
    this.map.addLayer(this.circle);
  }

  closeWindow() {
    this.popup = !(this.popup);
    this.popupChange.emit(this.popup);
    this.map.removeLayer(this.circle);
    this.map.getView().setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    this.map.getView().setZoom(14);
  }

  sendForm(name:HTMLInputElement, pointX:HTMLInputElement, pointY:HTMLInputElement, radius:HTMLInputElement) {
    let nameValue = name.value;
    let pointXValue = pointX.value;
    let pointYValue = pointY.value;
    let radiusValue = radius.value;
    let allClear = true;
    name.classList.remove('error');
    pointX.classList.remove('error');
    pointY.classList.remove('error');
    radius.classList.remove('error');
    //validator
    if (!/^.{3,30}$/.test(name.value)) {
      name.focus();
      name.classList.add('error');
      name.value = "";
      name.placeholder = "Od 3 do 30 znaków.";
      allClear = false;
    }
    if (!/^(-?\d+(\.\d+)?)$/.test(pointX.value)) {
      pointX.focus();
      pointX.classList.add('error');
      pointX.value = "";
      pointX.placeholder = "Podaj prawidłową wartość współrzędniej.";
      allClear = false;
    }
    if (!/^(-?\d+(\.\d+)?)$/.test(pointY.value)) {
      pointY.focus();
      pointY.classList.add('error');
      pointY.value = "";
      pointY.placeholder = "Podaj prawidłową wartość współrzędniej.";
      allClear = false;
    }
    if (!/^\d+$/.test(radius.value)) {
      radius.focus();
      radius.classList.add('error');
      radius.value = "";
      radius.placeholder = "Liczba musi być naturalna.";
      allClear = false;
    }
    if (!allClear) return;
    //others
    this.zoneService.putZone(this.zoneId, nameValue, pointXValue, pointYValue, Number(radiusValue)).subscribe(
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

  public refresh() {
    window.location.reload();
  }

}

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ZoneService} from "../services/zone.service";
import {listNames, Rate} from "../services/map.service";
declare var ol: any;

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit {

  private map!: any;

  @Input() popup = false;
  @Output() popupChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;

  popupOk = false;
  popupFail = false;

  latitude: number = 52.460394146699365;
  longitude: number = 16.917809968543395;
  rates!: Rate;
  names!: listNames[];
  points: Array<any> = [];
  empList: Array<any> = [];
  line: Array<any> = [];
  popupik!: string;
  popupTrigger!: HTMLDivElement;
  popupDiv!: HTMLDivElement;
  maxDate!:string;
  dateValue!:string;
  dateTimestamp!: number;
  radiusValue: string = '1000';
  circle: any;
  posY: string;
  posX: string;

  constructor(public zoneService: ZoneService) {}

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

  drawCircle(posY, posX) {
    this.map.removeLayer(this.circle);
    var centerLongitudeLatitude = ol.proj.fromLonLat([Number.parseFloat(posY), Number.parseFloat(posX)]);
    this.circle = new ol.layer.Vector({
      source: new ol.source.Vector({
        projection: 'EPSG:4326',
        features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, Number.parseInt(this.radiusValue)))]
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
    this.posY = null;
    this.posX = null;
    this.radiusValue = '1000';
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
    this.zoneService.addZone(nameValue, pointXValue, pointYValue, Number(radiusValue)).subscribe(
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

import {OnInit, Component, ViewChild, ElementRef, Renderer2, AfterViewInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {NgModel} from "@angular/forms";
import { DatePipe } from '@angular/common';


declare var ol: any;
export interface StartPoint {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
}

export interface Point {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
}

export interface EndPoint {
  throttle: number;
  time: number;
  gpsX: number;
  rpm: number;
  speed: number;
  gpsY: number;
}

export interface Rate {
  startPoints: StartPoint[];
  points: Point[];
  endPoints: EndPoint[];
}

export interface listNames {
  image: string;
  name: string;
  id: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;
  popupOn = false;
  userID = 0;

  @ViewChild('popupTrigger') toggleButton: ElementRef;

  constructor(private http:HttpClient, private router:Router, private renderer: Renderer2, private datePipe: DatePipe) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && this.popupOn){
        this.disablePopup();
      }
    });
  }

  latitude: number = 52.460394146699365;
  longitude: number = 16.917809968543395;
  rates: Rate;
  names: listNames;
  points: Array<any> = [];
  empList: Array<any> = [];
  line: Array<any> = [];
  popupik: string;
  popupTrigger: HTMLDivElement;
  popupDiv: HTMLDivElement;
  maxDate:string;
  dateValue:string;

  ngAfterViewInit() {
    this.popupTrigger = this.toggleButton.nativeElement
  }

  ngOnInit() {

    this.dateValue = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.popupik = "Popup";

    this.regexChanged('$');



    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 16
      })
    });

    var popup = new ol.Overlay({
      element: document.getElementById('popup')
    });
    this.map.addOverlay(popup);
    this.map.on('click', function(evt) {
      var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        return feature;
      });
      if (feature) {
        var coord = feature.getGeometry().getCoordinates();
        var coordInNormal = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        for(let rate of this.rates.points)
        {
          if ((coordInNormal[0].toFixed(10)===parseFloat(rate.gpsY).toFixed(10)) && (coordInNormal[1].toFixed(10)===parseFloat(rate.gpsX).toFixed(10)))
          {
            this.popupik = '<strong>Obroty:</strong> '+rate.rpm+' RPM<br><strong>Prędkość:</strong> '+rate.speed+' km/h<br><strong>Czas:</strong> '+this.datePipe.transform(rate.time*1000, 'H:mm')+' ';
          }
        }
      }
      var ol3_sprint_location = coord;
      popup.setPosition(ol3_sprint_location);
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

  chooseOption(value:number, text:string, date:HTMLElement) {
    this.userID = value;
    this.popupTrigger.innerHTML = text;
    this.changeMap(date);
  }

  regexChanged(regex:string) {
    if (regex==='') regex='$';
    this.http.get<listNames>('/API/users/listUserNames/'+regex+'/').subscribe(value => {
      this.names = value;
      this.showPopup();
    });
  }

  changeMap(date: HTMLElement) {
    var that = this;
    this.http.get<Rate>('/API/track/getTrackData/'+this.userID+'/'+this.dateValue+'/').subscribe(value => {
      this.rates = value;
      this.map.getLayers().forEach(function (layer) {
        that.map.removeLayer(layer);
      });
      this.map.getLayers().forEach(function (layer) {
        that.map.removeLayer(layer);
      });
      this.empList = [];
      this.line = [];
      this.points = [];
      for(let rate of this.rates.points)
      {
        this.line.push([rate.gpsY,rate.gpsX]);
        this.points.push(new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([rate.gpsY,rate.gpsX]))
        }))
        this.latitude = rate.gpsX;
        this.longitude = rate.gpsY;
      }
      //maps
      this.map.addLayer(new ol.layer.Tile({
        source: new ol.source.OSM()
      }));
      //lines
      var lineString = new ol.geom.LineString(this.line);
      lineString.transform('EPSG:4326', 'EPSG:3857');
      var feature = new ol.Feature({
        geometry: lineString,
        name: 'Line'
      });

      var lineStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#a120e7',
          width: 5
        })
      });

      var source = new ol.source.Vector({
        features: [feature]
      });
      var vector = new ol.layer.Vector({
        source: source,
        style: [lineStyle]
      });
      this.map.addLayer(vector);
      //points
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: this.points
        })
      });
      this.map.addLayer(layer);
      //green
      this.empList = [];
      for(let rate of this.rates.startPoints)
      {
        this.empList.push(new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([rate.gpsY,rate.gpsX]))
        }))
      }
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: this.empList
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.9,
            scale: 0.4,
            src: 'assets/green.png'
          }))
        })
      });
      this.map.addLayer(layer);
      //red
      this.empList = [];
      for(let rate of this.rates.endPoints)
      {
        this.empList.push(new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([rate.gpsY,rate.gpsX]))
        }))
      }
      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: this.empList
        }),
        style: new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.9,
            scale: 0.4,
            src: 'assets/red.png'
          }))
        })
      });
      this.map.addLayer(layer);

      this.map.getView().setCenter(ol.proj.transform([this.longitude, this.latitude], 'EPSG:4326', 'EPSG:3857'));
    });
  }
}

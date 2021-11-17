import {OnInit, Component, ViewChild, ElementRef, Renderer2, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { DatePipe } from '@angular/common';
import {listNames, MapService, Rate} from "../services/map.service";

declare var ol: any;

@Component({
  selector: 'app-map-devices',
  templateUrl: './map-devices.component.html',
  styleUrls: ['./map-devices.component.scss']
})
export class MapDevicesComponent implements OnInit, AfterViewInit {
  private map!: any;
  popupOn = false;
  userID = 0;

  @ViewChild('popupTrigger') toggleButton!: ElementRef;
  @ViewChild('mapElementRef', { static: true }) mapElementRef: ElementRef;

  constructor(private route: ActivatedRoute, private mapService: MapService, private router:Router,
              private renderer: Renderer2, public datePipe: DatePipe) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(e.target !== this.toggleButton.nativeElement && this.popupOn){
        this.disablePopup();
      }
    });
  }

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

  ngAfterViewInit()
  {
    this.popupTrigger = this.toggleButton.nativeElement;
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
    this.map.setTarget(this.mapElementRef.nativeElement);

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
        for(let rate of this.rates.endPoints)
        {
          if ((coordInNormal[0].toFixed(10)===parseFloat(rate.gpsY).toFixed(10)) && (coordInNormal[1].toFixed(10)===parseFloat(rate.gpsX).toFixed(10)))
          {
            this.popupik = '<strong>Koniec trasy</strong><br><strong>Obroty:</strong> '+rate.rpm+' RPM<br><strong>Prędkość:</strong> '+rate.speed+' km/h<br><strong>Czas:</strong> '+this.datePipe.transform(rate.time*1000, 'H:mm')+'<br><strong>Kierowca:</strong> '+rate.user+' ';
          }
        }
        for(let rate of this.rates.startPoints)
        {
          if ((coordInNormal[0].toFixed(10)===parseFloat(rate.gpsY).toFixed(10)) && (coordInNormal[1].toFixed(10)===parseFloat(rate.gpsX).toFixed(10)))
          {
            this.popupik = '<strong>Początek trasy</strong><br><strong>Obroty:</strong> '+rate.rpm+' RPM<br><strong>Prędkość:</strong> '+rate.speed+' km/h<br><strong>Czas:</strong> '+this.datePipe.transform(rate.time*1000, 'H:mm')+'<br><strong>Kierowca:</strong> '+rate.user+' ';
          }
        }
      }
      var ol3_sprint_location = coord;
      popup.setPosition(ol3_sprint_location);
    }, this);

    setTimeout(() => {
      this.route.params.subscribe(params => {
        if ((params['id']!=undefined) && (params['date']!=undefined))
        {
          this.userID = params['id'];
          this.dateValue = params['date'];
          this.changeMap();
          this.disablePopup();
          for (let name of this.names)
          {
            if (name.id==this.userID)
            {
              this.popupTrigger.innerHTML = name.name;
              return;
            }
          }
        }
      });
    }, 200);
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
    this.changeMap();
  }

  regexChanged(regex:string) {
    if (regex==='') regex='$';
    this.mapService.getListOfDevice(regex).subscribe(value => {
      this.names = value;
      this.showPopup();
    });
  }

  changeMap() {
    var that = this;
    this.dateTimestamp = new Date(this.dateValue).valueOf() / 1000;
    this.mapService.getTrackDataForDevice(this.userID, this.dateTimestamp).subscribe(value => {
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
      var track = 0;
      //maps
      this.map.addLayer(new ol.layer.Tile({
        source: new ol.source.OSM()
      }));
      for(let rate of this.rates.points)
      {
        if (rate.track!=track)
        {
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
          this.line = [];
        }
        track = rate.track;
        this.line.push([rate.gpsY,rate.gpsX]);
        this.points.push(new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([rate.gpsY,rate.gpsX]))
        }))
        this.latitude = rate.gpsX;
        this.longitude = rate.gpsY;
      }

      //lines after last
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

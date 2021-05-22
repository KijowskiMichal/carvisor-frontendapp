import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

declare var ol: any;
export interface Rate {
  Speed: number;
  gps_longitude: string;
  gps_latitude: string;
  RPM: number;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private map: any;

  constructor(private http:HttpClient, private router:Router) { }

  latitude: number = 52.460394146699365;
  longitude: number = 16.917809968543395;
  rates: Rate[];
  empList: Array<any> = [];
  popupik: string;

  ngOnInit() {
    this.popupik = "Popup";

    this.http.get<Rate[]>('/API/track/getTrackData/1/').subscribe(value => {
      this.rates = value;

      for(let rate of this.rates)
      {
        this.empList.push(new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(rate.gps_latitude), parseFloat(rate.gps_longitude)]))
        }))
        this.latitude = parseFloat(rate.gps_latitude);
        this.longitude = parseFloat(rate.gps_longitude);
      }

      this.map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([this.latitude, this.longitude]),
          zoom: 16
        })
      });

      var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: this.empList
        })
      });
      this.map.addLayer(layer);

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
          for(let rate of this.rates)
          {
            if ((coordInNormal[0].toFixed(10)===parseFloat(rate.gps_latitude).toFixed(10)) && (coordInNormal[1].toFixed(10)===parseFloat(rate.gps_longitude).toFixed(10)))
            {
              this.popupik = '<strong>Obroty:</strong> '+rate.RPM+' RPM<br><strong>Prędkość:</strong> '+rate.Speed+' km/h';
            }
          }
        }
        var ol3_sprint_location = coord;
        popup.setPosition(ol3_sprint_location);
      }, this);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

declare var ol: any;

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

  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([this.longitude, this.latitude]),
        zoom: 18
      })
    });

    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([this.longitude, this.latitude]))
          }),
          new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([this.longitude+1, this.latitude+1]))
          })
        ]
      })
    });
    this.map.addLayer(layer);

    var popup = new ol.Overlay({
      element: document.getElementById('popup')
    });
    this.map.addOverlay(popup);
    this.map.on('click', function(evt) {
      var feature = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        return feature;
      });
      if (feature) {
        var coord = feature.getGeometry().getCoordinates();
      }
      var ol3_sprint_location = coord;
      popup.setPosition(ol3_sprint_location);
    });
  }
}

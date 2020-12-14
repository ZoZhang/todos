import {ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {

  @ViewChild('googleMapContainer', { static: false }) gmap: ElementRef;
  public map: google.maps.Map;
  public lat = 45.4471431;
  public lng = 4.385250699999999;
  public coordinates;

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {

    if (!navigator.geolocation) {
      console.log('Votre navigateur ne prend pas en charge la géolocalisation');
      return;
    }

    navigator.geolocation.getCurrentPosition((position: Position) => {

      if (!position) {
        console.log('Impossible d\'obtenir l\'emplacement géographique');
      }

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      console.log('Current Position: ', this.lat, ',', this.lng);

      this.coordinates = new google.maps.LatLng(this.lat, this.lng);

      this.map = new google.maps.Map(this.gmap.nativeElement, {
        center: this.coordinates,
        zoom: 8
      });

      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        map: this.map
      });

      marker.setMap(this.map);
    });
  }

}

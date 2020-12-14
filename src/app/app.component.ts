import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {AgmMap, MapsAPILoader  } from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public lat = 45.4471431;
  public lng = 4.385250699999999;
  public zoom = 8;

  @ViewChild(AgmMap, {static: true}) public agmMap: AgmMap;

  constructor(private mapsAPILoader: MapsAPILoader) { }

  ngOnInit() {
    this.setCurrentPosition();
  }

  setCurrentPosition() {

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

      const latlng = {
        lat: this.lat,
        lng: this.lng
      };
      console.log('Current Position: ', latlng);

      this.mapsAPILoader.load().then(() => {
        const geocoder = new google.maps.Geocoder;
        geocoder.geocode({
          'location': latlng
        }, function(results) {
          if (results[0]) {
            this.currentLocation = results[0].formatted_address;
            console.log(this.currentLocation);
          } else {
            console.log('votre position ne trouve pas');
          }
        });
      });
    });
  }

}

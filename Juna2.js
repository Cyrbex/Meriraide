let map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([24.41, 62.82]),
    zoom: 5.8
  })

});

let aloitus = true;

function juna() {

  fetch('https://rata.digitraffic.fi/api/v1/train-locations/latest/').
      then((resp) => resp.json()).
      then(function(api) {

        let trainsArray = api;

        for (let i = 0; i < trainsArray.length; i++) {

          let junanNumero = trainsArray[i].trainNumber;
          let junanNopeus = trainsArray[i].speed;
          let junaLat = trainsArray[i].location.coordinates[0];
          let junaLong = trainsArray[i].location.coordinates[1];

          /*
          console.log('___________________________');
          console.log('Junan numero: '+ junanNumero);
          console.log('Junan nopeus: '+ junanNopeus);
          console.log('Koordinaatti x: ' + junaLat);
          console.log('Koordinaatti y: ' + junaLong);
         */

          let marker = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat([junaLat, junaLong]),
            ),
          });
          let vectorSource = new ol.source.Vector({
            features: [marker]
          });
          let markerVectorLayer = new ol.layer.Vector({
            source: vectorSource,
          });

          map.addLayer(markerVectorLayer);

          setTimeout(function() {
            map.removeLayer(markerVectorLayer)
          }, 5000);

          aloitus = false;

          marker.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
              crossOrigin: 'anonymous',
              src: 'junaicon.png'
            }))
          }));

        }

      });
}

if (aloitus) {
  juna();
}

setInterval(juna, 5000);

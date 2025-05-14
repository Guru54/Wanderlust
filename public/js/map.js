


mapboxgl.accessToken = maptoken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates,  // [longitude, latitude] starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
  // console.log(coordinates);

    const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates) // [longitude, latitude] coordinates of the marker
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML("<h4>" + listing.location + "</h4><p> Exact location provided after booking</p>")) // set the content of the popup
        .addTo(map); // add the marker to the map

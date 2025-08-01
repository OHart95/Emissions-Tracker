document.getElementById("trip-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the form from submitting normally
    console.log("Form submitted");

    const reg = document.getElementById("reg").value;
    const start = document.getElementById("start").value;
    const destination = document.getElementById("destination").value;

    calculateAndDisplayRoute(start, destination);
});


let map;
let directionsService;
let directionsRenderer;

function initMap() {
  // Create the map centered on the UK
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 54.5, lng: -3 }, // UK center-ish
    zoom: 6,
  });

  // Set up routing services
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

function calculateAndDisplayRoute(start, end) {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        const route = response.routes[0];
        const leg = route.legs[0];

        const distanceText = leg.distance.text;
        const durationText = leg.duration.text;

        document.getElementById("route-info").innerHTML = `

        <h3>Route Information</h3>
        <p><strong>Distance:</strong> ${distanceText}</p>
        <p><strong>Estimated time:</strong> ${durationText}</p>
        `;

      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}

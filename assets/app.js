async function fetchVehicleData(registration) {
  const response = await fetch("http://localhost:3000/lookup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ registration })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch vehicle data");
  }

  const data = await response.json();
  return {
    co2Emissions: data.co2Emissions,
    make: data.make,
    yearOfManufacture: data.yearOfManufacture,
    fuelType: data.fuelType
  };
}





document.getElementById("trip-form").addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Form submitted");

    const reg = document.getElementById("reg").value;
    const start = document.getElementById("start").value;
    const destination = document.getElementById("destination").value;

    calculateAndDisplayRoute(start, destination, reg);
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

async function calculateAndDisplayRoute(start, destination, reg) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
        {
            origin: start,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        },
        async function(response, status) {
            if (status === "OK") {
                directionsRenderer.setDirections(response);

                // Extract distance from the first route leg
                const route = response.routes[0].legs[0];
                const distanceInMeters = route.distance.value;
                const distanceInKm = (distanceInMeters / 1000).toFixed(2);

                try {
                    const vehicleData = await fetchVehicleData(reg);
                    const emissionsPerKm = vehicleData.co2Emissions; // in g/km
                    const totalEmissions = (distanceInKm * emissionsPerKm).toFixed(2); // in grams

                    document.getElementById("route-info").innerHTML = `
                        <p><strong>Vehicle Info:</strong></p>
                        <p>Make: ${vehicleData.make}</p>
                        <p>Year: ${vehicleData.yearOfManufacture}</p>
                        <p>Fuel Type: ${vehicleData.fuelType}</p>
                        <p>CO₂ Emissions: ${emissionsPerKm} g/km</p>
                        <hr>
                        <p><strong>Trip Info:</strong></p>
                        <p>Distance: ${distanceInKm} km</p>
                        <p><strong>Total Trip Emissions: ${totalEmissions} g CO₂</strong></p>
                    `;
                } catch (error) {
                    console.error("Error fetching vehicle data:", error);
                    document.getElementById("route-info").innerText = "Failed to fetch vehicle emissions data.";
                }

            } else {
                alert("Directions request failed due to " + status);
            }
        }
    );
}


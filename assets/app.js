document.getElementById("trip-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the form from submitting normally
    console.log("Form submitted");

    const reg = document.getElementById("reg").value;
    const start = document.getElementById("start").value;
    const destination = document.getElementById("destination").value;

    console.log({reg, start, destination});

});
const distroSections = document.getElementsByClassName('content-box');

Array.prototype.forEach.call(distroSections, el => el.style.display = "none");
var activeTextboxId = distroSections[0].id;
distroSections[0].style.display = "block";

window.addEventListener('hashchange', () => {
    var locationId = window.location.hash.substring(1);
    if (locationId === "") locationId = "linux";
    document.getElementById(activeTextboxId).style.display = "none";
    activeTextboxId = locationId;
    document.getElementById(locationId).style.display = "block";
});
fetch("../templates/header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data);

fetch("../templates/footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

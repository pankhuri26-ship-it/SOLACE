socket.on("verification-update", data => {
  document.getElementById("verificationBar").style.width = data.trustScore + "%";
  document.getElementById("verificationPercent").innerText =
    data.trustScore + "% Verified";
});

socket.on("dispatch-confirmed", data => {
  document.getElementById("dispatchDetails").classList.remove("hidden");
});
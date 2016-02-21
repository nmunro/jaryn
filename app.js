(function() {
  const jaryn = new Jaryn();
  jaryn.UI.init();
      
  document.getElementById("mood").addEventListener("change", jaryn.UI.setMood);
  document.getElementById("submitStatus").addEventListener("click", jaryn.UI.submitStatus);
}());
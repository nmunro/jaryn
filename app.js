(function() {
  /*const jaryn = new Jaryn();
  jaryn.UI.init();*/
  
  const showDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main");  
  const hideDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main invisible");  
  const toggleDiv = (e) => {
    Array.from(document.getElementsByClassName("contentDiv")).forEach(hideDiv);
    showDiv(document.getElementById(e.target.getAttribute("data-target")));
  };
      
  document.querySelector("#dashboard").addEventListener("click", toggleDiv);
  document.querySelector("#history").addEventListener("click", toggleDiv);
  document.querySelector("#help").addEventListener("click", toggleDiv);
}());
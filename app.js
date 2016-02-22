(function() {
  /*const jaryn = new Jaryn();
  jaryn.UI.init();*/
  
  const showNav = (nav) => nav.setAttribute("class", "navLink active");
  const hideNav = (nav) => nav.setAttribute("class", "navLink");
  const showDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main");  
  const hideDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main invisible");  
      
  Array.from(document.getElementsByClassName("contentDiv")).forEach((div) => div.addEventListener("click", (e) => {
    Array.from(document.getElementsByClassName("contentDiv")).forEach(hideDiv);
    showDiv(document.getElementById(e.target.getAttribute("data-target")));
  }));

  Array.from(document.getElementsByClassName("navLink")).forEach((nav) => nav.addEventListener("click", (e) => {
    Array.from(document.getElementsByClassName("navLink")).forEach(hideNav);
    showNav(document.getElementById(e.target));
  }));
}());

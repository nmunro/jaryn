(function() {
  const jaryn = new Jaryn();
  jaryn.init();
  
  const showNav = (nav) => nav.setAttribute("class", "navLink active");
  const hideNav = (nav) => nav.setAttribute("class", "navLink");
  const showDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main");  
  const hideDiv = (div) => div.setAttribute("class", "contentDiv col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main invisible");  
  const toggleDiv = (div) => {
    Array.from(document.getElementsByClassName("contentDiv")).forEach(hideDiv);
    showDiv(div);
  };   
  
  Array.from(document.getElementsByClassName("contentDiv")).forEach((div) => {
    div.addEventListener("click", (e) => toggleDiv(div));
  });

  Array.from(document.getElementsByClassName("navLink")).forEach((nav) => {
    nav.addEventListener("click", (e) => {
      Array.from(document.getElementsByClassName("navLink")).forEach(hideNav);
      Array.from(document.getElementsByClassName("contentDiv")).forEach(hideDiv);
      showNav(e.target.parentNode);
      showDiv(document.getElementById(nav.firstChild.getAttribute("data-target")));
    });
  });
}());

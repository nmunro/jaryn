(function() {
  const jaryn = Jaryn();
  const tbody = document.getElementById("historyTable");  
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
      Array.from(document.getElementsByClassName("contentDiv")).forEach(hideDiv);
      Array.from(document.getElementsByClassName("navLink")).forEach(hideNav);
      showDiv(document.getElementById(nav.firstChild.getAttribute("data-target")));
      showNav(e.target.parentNode);
    });
  });
  
  jaryn.init();
  jaryn.getHistory().forEach((obj) => {
    const row = document.createElement('tr');
    const id = document.createElement('td');
    const date = document.createElement('td');
    const mood = document.createElement('td');
    const feelings = document.createElement('td');
    const notes = document.createElement('td');
    var year = 0;
    var month = 0;
    var day = 0;
    
    id.innerHTML = obj.id;
    year = obj.date.getFullYear();
    month = (obj.date.getMonth() + 1 < 10) ? "0" + (obj.date.getMonth() + 1) : obj.date.getMonth + 1;
    day = (obj.date.getDate() < 10) ? "0" + obj.date.getDate(): obj.date.getDate();
    date.innerHTML = year + "/" + month + "/" + day;
      
    mood.innerHTML = obj.mood;
    feelings.innerHTML = obj.feelings.reduce((prev, current) => prev + ", " + current);
    notes.innerHTML = obj.notes;
    
    row.appendChild(id);
    row.appendChild(date);
    row.appendChild(mood);
    row.appendChild(feelings);
    row.appendChild(notes);
    tbody.appendChild(row);
  });
}());

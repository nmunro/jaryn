(function() {
  const jaryn = Jaryn();
  const showNav = (nav) => nav.classList.add("active");
  const hideNav = (nav) => nav.classList.remove("active");
  const showDiv = (div) => div.classList.remove("invisible");
  const hideDiv = (div) => div.classList.add("invisible");
  const toggleDiv = (div) => {
    Array.from(document.querySelectorAll(".contentDiv")).forEach(hideDiv);
    showDiv(div);
  };
  const setDate = (() => {
    const now = new Date();
    const date = document.querySelector("#date");
    var month = now.getMonth()+1;
    var day = now.getDate();
    
    if(month < 10) month = "" + 0 + month;
    if(day < 10) day = "" + 0 + day;
      
    date.innerHTML = day + "/" + month + "/" + now.getFullYear();
  });
  
  setDate();

  Array.from(document.querySelectorAll(".contentDiv")).forEach((div) => {
    div.addEventListener("click", (e) => toggleDiv(div));
  });

  Array.from(document.getElementsByClassName("navLink")).forEach((nav) => {
    nav.addEventListener("click", (e) => {
      Array.from(document.querySelectorAll(".contentDiv")).forEach(hideDiv);
      Array.from(document.querySelectorAll(".navLink")).forEach(hideNav);
      showDiv(document.querySelector("#" + nav.firstChild.getAttribute("data-target")));
      showNav(e.target.parentNode);
    });
  });

  // Populate history table.
  jaryn.io.readHistory((data) => {
    const tbody = document.querySelector("#historyTable");
    const moods = document.querySelector("#averageMood");
    const emotions = document.querySelector("#averageEmotions");
    var averageMood = 0;
    var averageEmotions = {};
    
    data.forEach((obj) => {
      const row = document.createElement('tr');
      const id = document.createElement('td');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      const dt = new Date(obj.date);
      const year = dt.getFullYear();
      const month = (dt.getMonth() + 1 < 10) ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = (dt.getDate() < 10) ? "0" + dt.getDate() : dt.getDate();

      id.innerHTML = obj.id;
      date.innerHTML = day + "/" + month + "/" + year;
      mood.innerHTML = obj.mood;
      averageMood += obj.mood;
      obj.feelings.forEach((emotion) => {
        if(averageEmotions[emotion] !== undefined)
          averageEmotions[emotion] = averageEmotions[emotion] + 1;
        else
          averageEmotions[emotion] = 1;
      });
      feelings.innerHTML = obj.feelings.reduce((prev, current) => prev + ", " + current);
      notes.innerHTML = obj.notes;

      row.appendChild(id);
      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
    });
    
    averageMood /= data.length;
    moods.innerHTML = averageMood;
    Object.keys(averageEmotions).forEach((emotion) => {
      console.log(emotion + ": " + averageEmotions[emotion]);  
    });
    //emotions.innerHTML = averageEmotions.join(", ");
  });
}());

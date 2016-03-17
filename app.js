const App = Object.freeze(Object.create({
  "showNav": function(nav) { nav.classList.add("active"); },
  
  "hideNav": function(nav) { nav.classList.remove("active"); },
  
  "showDiv": function(div) { div.classList.remove("invisible"); },
  
  "hideDiv": function(div) { div.classList.add("invisible"); },
  
  "toggleDiv": function(div) {
    const nodes = Array.from(document.querySelectorAll(".contentDiv"));
    nodes.forEach(this.hideDiv);
    this.showDiv(div);
  },
  
  "setDate": function() {
    const now = new Date();
    const date = document.querySelector("#date");
    const month = ((now.getMonth() +1) < 10) ? "" + 0 + (now.getMonth()+1) : now.getMonth()+1;
    const day = (now.getDate() < 10) ? "" + 0 + now.getDate() : now.getDate();
      
    date.innerHTML = day + "/" + month + "/" + now.getFullYear();
  },
  
  "setMoodValue": function(value) {
    document.getElementById('moodValue').innerHTML = value;
  },
  
  "setupEventHandlers": function() {
     // Save button event handler.
    document.getElementById("save").addEventListener("click", () => {
      const data = {};
      const now = new Date();
      const mood = document.getElementById("mood").value;
      const notes = document.getElementById("notes").value;
      const nodes = document.getElementsByClassName("emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();
      
      now.setTime(0);
      now.setYear(year);
      now.setMonth(month);
      now.setDate(date);
      
      data.id = now.getTime();
      data.date = now;
      data.mood = parseInt(mood, 10);
      data.notes = notes;
      data.feelings = feelings.map((node) => node.id); 
      
      Jaryn.updateDiary(data, (obj) => {
        this.showHistory(obj);
        
        // Fix these
        //this.displayAverageMood(obj);
        //this.displayAverageFeelings(obj);
      });
    });

    // Add event handlers.
    Array.from(document.querySelectorAll(".contentDiv")).forEach((div) => {
      div.addEventListener("click", (e) => this.toggleDiv(div));
    });
  
    document.getElementById('mood').addEventListener('change', (event) => {
      this.setMoodValue(event.target.value);
    });

    Array.from(document.getElementsByClassName("navLink")).forEach((nav) => {
      nav.addEventListener("click", (e) => {
        const contentNodes = Array.from(document.querySelectorAll(".contentDiv"));
        const navNodes = Array.from(document.querySelectorAll(".navLink"));
        const target = nav.firstChild.getAttribute("data-target");
        
        contentNodes.forEach(this.hideDiv);
        navNodes.forEach(this.hideNav);
        
        this.showDiv(document.querySelector("#" + target));
        this.showNav(e.target.parentNode);
      });
    }); 
  },
  
  "showAverageMood": function(data) {
    const moods = document.querySelector("#averageMood").innerHTML = data;
  },
  
  // Figure out what to do with this!
  "showAverageFeelings": function(allEmotions) {
    const emotions = document.querySelector("#averageEmotions");
    emotions.innerHTML = allEmotions.join(", ");
  },
  
  "showHistory": function(data) {
    const tbody = document.querySelector("#historyTable");
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
    console.log("Data");
    console.log(data);
    
    Object.keys(data).forEach((obj) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      
      const dt = new Date();
      dt.setTime(obj);
      const year = dt.getFullYear();
      const month = (dt.getMonth() + 1 < 10) ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
      const day = (dt.getDate() < 10) ? "0" + dt.getDate() : dt.getDate();

      date.innerHTML = day + "/" + month + "/" + year;
      mood.innerHTML = (data[obj]) ? data[obj].mood : "-";
      notes.innerHTML = (data[obj]) ? data[obj].notes : "-";
      feelings.innerHTML = (data[obj]) ? data[obj].feelings.reduce((p, n) => p + ", " + n) : "-";

      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
    });
  },
  
  "init": function() {
    this.setDate();
    this.setupEventHandlers();
    this.setMoodValue("5");
    
    Jaryn.loadConfig((conf) => {
      this.showAverageMood(conf.averageMood);
      this.showAverageFeelings(conf.averageEmotion);
      
      // Only read data files if config is loaded.
      Jaryn.getSevenDayHistory(d => this.showHistory(d));
    });
  } 
}));

App.init();
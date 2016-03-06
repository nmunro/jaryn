// If it touches the DOM it belongs here, don't pass any DOM
// manipulation into Jaryn.js, callbacks are ok though.

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
    const month = ((now.getMonth() +1)< 10) ? "" + 0 + (now.getMonth()+1) : now.getMonth()+1;
    const day = (now.getDate() < 10) ? "" + 0 + now.getDate() : now.getDate();
      
    date.innerHTML = day + "/" + month + "/" + now.getFullYear();
  },
  
  "setMoodValue": function(value) {
    document.getElementById('moodValue').innerHTML = value;
  },
  
  "connectEventHandlers": function() {
     // Save button event handler.
    document.getElementById("save").addEventListener("click", () => {
      const now = new Date();
      const mood = document.getElementById("mood").value;
      const notes = document.getElementById("notes").value;
      const nodes = document.getElementsByClassName("emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      var data = {
        "id": now.getTime(),
        "date": now,
        "mood": 0,
        "notes": ""
      };
      
      data.mood = parseInt(mood, 10);
      data.notes = notes;
      data.feelings = feelings.map((node) => node.id); 
      
      Jaryn.updateJSON("jaryn.json", data, (obj) => {
        this.displayHistory(obj);
        this.displayAverageMood(obj);
        this.displayAverageFeelings(obj);
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
  
  "displayAverageMood": function(data) {
    const moods = document.querySelector("#averageMood");
    const avg = data.map((d) => d.mood).reduce((p, n) => p + n) / data.length;
    moods.innerHTML = Math.round(avg);
  },
  
  // Figure out what to do with this!
  "displayAverageFeelings": function(data) {
    const emotions = document.querySelector("#averageEmotions");
    const allEmotions = data.map((d) => d.feelings);
    const emotionCollection = [];
    const emotionCount = {};
    var highestCount = 0;
    
    allEmotions.forEach((emotion) => {
      emotion.forEach((e) => {
        if(emotionCount[e] !== undefined) emotionCount[e]++; 
        else emotionCount[e] = 1;
      });
    });
     
    // Loop over keys and find the highest numbered one.
    Object.keys(emotionCount).forEach((elm) => {
      if(emotionCount[elm] > highestCount) highestCount = emotionCount[elm]; 
    });
    
    // Get all the emotions with the same emotion count.
    Object.keys(emotionCount).forEach((elm) => {
      if(emotionCount[elm] === highestCount) emotionCollection.push(elm);
    });
    
    emotions.innerHTML = emotionCollection.reduce((p, n) => p + ", " + n);
  },
  
  "displayHistory": function(data) {
    const tbody = document.querySelector("#historyTable");
    
    if(data === undefined) return;
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
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
      notes.innerHTML = obj.notes;
      feelings.innerHTML = obj.feelings.reduce((p, n) => p + ", " + n);

      row.appendChild(id);
      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
    });
  },
  
  "init": function() {
    this.setDate();
    this.connectEventHandlers();
    this.setMoodValue("5");
    
    Jaryn.readJSON("jaryn.json", (data) => {
      this.displayAverageMood(data);
      this.displayAverageFeelings(data);
      this.displayHistory(data);
    });
  } 
}));

App.init();
const App = Object.freeze(Object.create({
  "showNav": function(nav) { nav.classList.add("active"); },
  
  "hideNav": function(nav) { nav.classList.remove("active"); },
  
  "showDiv": function(div) { div.classList.remove("invisible"); },
  
  "hideDiv": function(div) { div.classList.add("invisible"); },
  
  "toggleDiv": function(div) {
    Array.from(document.querySelectorAll(".contentDiv")).forEach(this.hideDiv);
    this.showDiv(div);
  },
  
  "setDate": function() {
    const {year, month, day} = DateUtil.getYYYYMMDD(new Date());
    document.querySelector("#date").innerHTML = `${day}/${month}/${year}`;
  },
  
  "setMoodValue": function(value) {
    document.querySelector('#moodValue').innerHTML = value;
  },
  
  "setSevenDayAverageMood": function(val) {
    document.querySelector("#moodMeter").value = val*10;  
    document.querySelector("#moodMeterLbl").innerHTML = `${Math.floor(val*10)}%`;
  },
  
  "setupEventHandlers": function() {
     // Save button event handler.
    document.querySelector("#save").addEventListener("click", () => {
      const data = {};
      const now = new Date();
      const mood = document.querySelector("#mood").value;
      const notes = document.querySelector("#notes").value;
      const nodes = document.querySelectorAll(".emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      
      now.setTime(0);
      now.setYear(year);
      now.setMonth(month);
      now.setDate(day);
      
      data.id = now.getTime();
      data.date = now;
      data.mood = parseInt(mood, 10);
      data.notes = notes;
      data.feelings = feelings.map((node) => node.id); 
      
      VFS.updateDiary(data, () => this.init());
    });

    // Add event handlers.
    Array.from(document.querySelectorAll(".contentDiv")).forEach((div) => {
      div.addEventListener("click", () => this.toggleDiv(div));
    });
  
    document.querySelector("#mood").addEventListener('change', (event) => {
      this.setMoodValue(event.target.value);
    });

    Array.from(document.querySelectorAll(".navLink")).forEach((nav) => {
      nav.addEventListener("click", (event) => {
        const target = nav.firstChild.getAttribute("data-target");
        Array.from(document.querySelectorAll(".contentDiv")).forEach(this.hideDiv);
        Array.from(document.querySelectorAll(".navLink")).forEach(this.hideNav);
        
        this.showDiv(document.querySelector("#" + target));
        this.showNav(event.target.parentNode);
      });
    }); 
  },
  
  "showAverageMood": function(data) {
    const moods = document.querySelector("#averageMood").innerHTML = data;
  },
  
  // Figure out what to do with this!
  "showAverageFeelings": function(emotions) {
    document.querySelector("#averageEmotions").innerHTML = emotions.join(", ");
  },
  
  "showHistory": function(data) {
    const moodObj = [];
    const tbody = document.querySelector("#historyTable");
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
    Object.keys(data).forEach((obj, count) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      
      const dt = new Date();
      dt.setTime(obj);
      const year = dt.getFullYear();
      const month = (dt.getMonth()+1 < 10) ? `0${dt.getMonth()+1}` : dt.getMonth()+1;
      const day = dt.getDate();
      
      if(data[obj]) moodObj.push(data[obj].mood);
      
      date.innerHTML = `${day}/${(month)}/${year}`;
      mood.innerHTML = (data[obj]) ? data[obj].mood : "-";
      notes.innerHTML = (data[obj] && data[obj].notes !== "") ? data[obj].notes : "-";
      feelings.innerHTML = (data[obj]) ? data[obj].feelings.reduce((p, n) => p + ", " + n) : "-";

      row.appendChild(date);
      row.appendChild(mood);
      row.appendChild(feelings);
      row.appendChild(notes);
      tbody.appendChild(row);
    });
    
    // Bail out if there's no data.
    if(moodObj.length === 0) return;
    this.setSevenDayAverageMood(moodObj.reduce((p, n) => p+n) / moodObj.length);
  },
  
  "init": function() {
    this.setDate();
    this.setMoodValue("5");
    
    VFS.loadConfig((conf) => {
      this.showAverageMood(conf.averageMood);
      this.showAverageFeelings(conf.averageEmotion);
      VFS.getSevenDayHistory((d) => this.showHistory(d));
    });
  } 
}));

App.setupEventHandlers();
App.init();
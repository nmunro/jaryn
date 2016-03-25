const App = Object.freeze(Object.create({
  "showNav": function(nav) {
    nav.classList.add("active");
  },
  
  "hideNav": function(nav) {
    nav.classList.remove("active");
  },
  
  "hideNavAll": function() {
    Array.from(document.querySelectorAll(".navLink")).forEach(this.hideNav);
  },
  
  "showDiv": function(div) {
    div.classList.remove("invisible");
  },
  
  "hideDiv": function(div) {
    div.classList.add("invisible");
  },
  
  "hideDivAll": function() {
    Array.from(document.querySelectorAll(".contentDiv")).forEach(this.hideDiv);
  },
  
  "toggleDiv": function(div) {
    this.hideDivAll();
    this.showDiv(div);
  },
  
  "setDate": function() {
    const text = [6, 0].map((n) => {
      const {year, month, day} = DateUtil.getYYYYMMDD(n);
      return `${day}/${month}/${year}`;
    });
    document.querySelector("#date").innerHTML = text.join("&nbsp;-&nbsp;");
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
      const mood = document.querySelector("#mood").value;
      const notes = document.querySelector("#notes").value;
      const nodes = document.querySelectorAll(".emotion");
      const feelings = Array.from(nodes).filter((node) => node.checked);
      const now = DateUtil.getDate();
      const data = {};
      
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
        this.hideDivAll();
        this.hideNavAll();
        
        this.showDiv(document.querySelector("#" + target));
        this.showNav(event.target.parentNode);
      });
    }); 
  },
  
  "showHistory": function(data) {
    const moodObj = [];
    const tbody = document.querySelector("#historyTable");
    
    while(tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
    
    Object.keys(data).forEach((obj) => {
      const row = document.createElement('tr');
      const date = document.createElement('td');
      const mood = document.createElement('td');
      const feelings = document.createElement('td');
      const notes = document.createElement('td');
      const dt = new Date(parseInt(obj, 10));
      const fn = (p, n) => `${p}, ${n}`;
      
      if(!data[obj]) {
        data[obj] = {
          "mood": 0,
          "feelings": ["-"],
          "notes": "-"
        };   
      }
      
      moodObj.push(data[obj].mood);
      
      mood.innerHTML = `${(data[obj].mood*10)}%`;
      feelings.innerHTML = data[obj].feelings.reduce(fn);
      notes.innerHTML = (data[obj].notes !== "") ? data[obj].notes : "-";
      date.innerHTML = `${dt.getDate()}/`;
      date.innerHTML += `${DateUtil.zeroPad(dt.getMonth()+1)}/`;
      date.innerHTML += `${dt.getFullYear()}`;

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
    
    this.hideDivAll();
    this.hideNavAll();
    
    this.showDiv(document.querySelector("#dashboardDiv"));
    this.showNav(document.querySelector("#dashboard").parentNode);
    
    VFS.loadConfig((conf) => {
      VFS.getSevenDayHistory((d) => this.showHistory(d));
    });
  } 
}));

App.setupEventHandlers();
App.init();
const Jaryn = function() { return(this === window) ? new Jaryn() : this; };

Jaryn.prototype.UI = {
  "addRecord": (record) => {
    const tb = document.getElementById('tb');
    const tr = document.createElement('tr');
    const id = document.createElement('td');
    const date = document.createElement('td');
    const data = document.createElement('td');
    
    id.innerHTML = record.id;
    date.innerHTML = record.date;
    data.innerHTML = "Nothing yet!";
    
    tr.appendChild(id);
    tr.appendChild(date);
    tr.appendChild(data);
    tb.appendChild(tr);
  },
  
  "removeRecord": (record) => console.log("Unimplemented!"),
  
  "removeAllRecords": () => {
    const tb = document.getElementById('tb');
    while(tb.hasChildNodes()) tb.removeChild(tb.firstChild);
  },
  
  "setMood": () => {
    document.getElementById("moodValue").innerHTML = document.getElementById("mood").value + "0%";
  },
  
  "submitStatus": () => {
    const mood = document.getElementById("mood").value;
    const feelingScore = Array.from(document.getElementsByClassName("feeling")).map((element) => {
      return Number(element.checked) ? Number(element.getAttribute("data-mood")): 0;
    }).reduce((prev, cur) => prev + cur);
    console.log({"mood": Number(mood), "feelings": Number(feelingScore)});
  }
};

Jaryn.prototype.DB = {
  "loadRecord": (id) => JSON.parse(localStorage.getItem(id)),
  
  "loadRecords": () => Jaryn.prototype.DB.getAll().forEach(Jaryn.prototype.UI.addRecord),
  
  "deleteRecord": (id) => localStorage.removeItem(id),
  
  "deleteAll": () => {
    localStorage.clear();
    Jaryn.prototype.UI.removeAllRecords();
  },
  
  "getAll": () => {
    const ids = JSON.parse(localStorage.getItem("indexTable")) || [];
    return ids.map((id) => JSON.parse(localStorage.getItem(id)));
  },
  
  "save": (record) => {
    const date = new Date();
    const indexTable = JSON.parse(localStorage.getItem("indexTable")) || [];
    
    record.id = date.getTime();
    record.date = date.toDateString();
    indexTable.push(date.getTime());
    localStorage.setItem(date.getTime(), JSON.stringify(record));
    localStorage.setItem("indexTable", JSON.stringify(indexTable));
    Jaryn.prototype.UI.addRecord(record);
    
    return date.getTime();
  },
  
  "toJSON": () => console.log("Unimplemented!"),
  "sync": () => console.log("Unimplemented!") 
};
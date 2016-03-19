const DateUtil = Object.freeze(Object.create({
  "getYYYYMMDD": function() {
    const date = new Date();
    return {
      "year": "" + date.getFullYear(),
      "month": "" + this.zeroPad(date.getMonth()+1),
      "day": "" + this.zeroPad(date.getDate())
    };
  },
  
  "zeroPad": function(date) {
    return (date < 10) ? "0" + date : date;  
  }
}));
const DateUtil = Object.freeze(Object.create({
  /**
   * Use this function for display purposes only.
   */
  "getYYYYMMDD": function(offset) {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset();
    
    if(offset) date.setDate(date.getDate()-offset);
    
    return {
      "year": "" + date.getFullYear(),
      "month": "" + this.zeroPad(date.getMonth()+1),
      "day": "" + this.zeroPad(date.getDate())
    };
  },
  
  /**
   * If a value is in the single digits then it's prefixed with a zero.
   */
  "zeroPad": function(date) {
    return (date < 10) ? "0" + date : date;  
  },
  
  /**
   * Use this function for getting and calculating a date.
   */
  "getDate": function() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }
}));
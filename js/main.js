var startDate = new Date();
console.log(startDate.toLocaleString());
var el = document.getElementById("checkIn-DatePickerButtonInput");

var el_checkout = document.getElementById("checkOut-DatePickerButtonInput");

// option configuration syntax        
let dpn = new  DatePickerNative({            
    element: el,
    activeDate: startDate,
    // + or - 5 days - optional
    min: -1,
    max: 1000,
    onDateChanged: function(dt, event) {
        // update date display
        // showDate(dt,"ActiveDate");
        showDate(dt,"checkIn-ActiveDateDay");
        showMonth(dt,"checkIn-ActiveDateMonth");
        console.log(dt.toLocaleString()," Callback date value");

        // element gets a dateValue property
        var el = document.getElementById("checkIn-DatePickerButtonInput");
        console.log(el.dateValue.toLocaleString()," Date on control");

        // date control value
        //console.log(DateFormatter.formatDate(dpn.options.activeDate,"dw MMM dd, yyyy")," instance.option.activeDate");
    }        
});


let dpn_checkout = new  DatePickerNative({            
    element: el_checkout,
    activeDate: startDate,
    // + or - 5 days - optional
    min: -1,
    max: 1000,
    onDateChanged: function(dt, event) {
        // update date display
        // showDate(dt,"ActiveDate");
        showDate(dt,"checkOut-ActiveDateDay");
        showMonth(dt,"checkOut-ActiveDateMonth");
        console.log(dt.toLocaleString()," Callback date value");

        // element gets a dateValue property
        var el = document.getElementById("checkOut-DatePickerButtonInput");
        console.log(el.dateValue.toLocaleString()," Date on control");

        // date control value
        //console.log(DateFormatter.formatDate(dpn.options.activeDate,"dw MMM dd, yyyy")," instance.option.activeDate");
    }        
});

    
    // assign initial display value on page launch
    showDate(startDate,"checkIn-ActiveDateDay");
    showMonth(startDate,"checkIn-ActiveDateMonth");

    showDate(startDate,"checkOut-ActiveDateDay");
    showMonth(startDate,"checkOut-ActiveDateMonth");

// var elInput = document.getElementById("DatePickerInput");

//     // parameter syntax - Standard Date Input control
//     new DatePickerNative({ 
//     element: elInput, 
//     activeDate: startDate,                  
//     onDateChanged: function(dt, event, instance) {
//         // showDate(dt, "ActiveDateInput");
//         showDate(dt,"checkIn-ActiveDateDay");
//         showMonth(dt,"checkIn-ActiveDateMonth");

        
//         console.log(dt.toLocaleString()," Callback date value Date Input control");
//     }        
// });
// // showDate(startDate,"ActiveDateInput");

// showDate(startDate,"checkIn-ActiveDateDay");
// showMonth(startDate,"checkIn-ActiveDateMonth");

// showDate(startDate,"checkOut-ActiveDateDay");
// showMonth(startDate,"checkOut-ActiveDateMonth");


// display helper
    function showDate(dt,elId) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct","Nov", "Dec"];
    var sdt = dt.getDate();
    // dt.getDate
    document.getElementById(elId).innerText = sdt;
}                  

function showMonth(dt,elId) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct","Nov", "Dec"];
    var sdt = months[dt.getMonth()];
    // dt.getDate
    document.getElementById(elId).innerText = sdt;
}   


// ------------------


function DatePickerNative(el, initialDate, onDateChanged) {
    var _this = this;
    var opt = null;
    
    if (typeof el == "string")
    {
        if (el === "uninitialize") {
            uninitialize();
            return;
        }
        el = document.getElementById(el);
        if (!el) {
            throw new Error("Invalid element provided. Provide either an DOM Element or an id string to an element.");            
        }
    }
    
    if (el.element) {        
        opt = el;  // assume options object was passed
    }
    else {
        opt =  {
            element: el,
            onDateChanged: onDateChanged,
            activeDate: initialDate,
            min: "",  // number as string
            max: ""   // number as string     
        };        
    }
    this.options = opt;

    function intialize(opt) {
        if(typeof opt.activeDate != 'object')
            opt.activeDate = new Date();

        if (opt.element) {
            opt.element.addEventListener("change",datePickerUnbind);     
            datePickerBind(opt.element,opt.activeDate, opt.onDateChanged);
        }
    }    

    function uninitialize(){
        opt.element.removeEventListener("change",datePickerUnbind);        
    }
    
    function datePickerBind(element, dt) {        
        var newDate = localToGmtDate(dt);
        
        opt.element.dateValue = dt;   // original date        
        opt.element.value = newDate;

        if (opt.min)
            opt.element.min = normalizeMin(opt.min);        
        if (opt.max)
            opt.element.max = normalizeMax(opt.max);
    }
    
    function datePickerUnbind(event) {        
        var dt = event.target.valueAsDate;
        let newDate =  utcToLocalDate(dt);
        
        opt.element.dateValue = newDate;
        opt.activeDate = newDate;

        if(opt.onDateChanged){
            opt.onDateChanged(newDate, event, _this);
        }
    }

    function localToGmtDate(localDate) {
        return localDate && new Date(localDate.getTime()-(localDate.getTimezoneOffset()*60*1000)).toISOString().split('T')[0];        
    }
    
    function utcToLocalDate(utcDate) {
        return new Date(utcDate.getTime()+(utcDate.getTimezoneOffset()*60*1000));        
    }

    function normalizeMin(minVal) {    
        if (typeof minVal === "string")
            return minVal;

        if (typeof minVal === "number") {
            let dt = new Date();
            dt = new Date(dt.setDate(dt.getDate() - minVal));
            minVal = dt;
        }

        return localToGmtDate(minVal);
    }

    function normalizeMax(maxVal) {
        if (typeof maxVal === "string") {            
            return maxVal;
        }

        let dt = new Date();
        if (typeof maxVal === "number") {
           dt = new Date();
           dt = new Date(dt.setDate(dt.getDate() + maxVal));
           maxVal = dt;
        }

        return localToGmtDate(maxVal);
    }

    intialize(opt);                
    return _this;
}
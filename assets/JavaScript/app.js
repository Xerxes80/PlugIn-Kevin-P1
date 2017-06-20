var config = {
  apiKey: "AIzaSyCUa3OmzBQAV9MHxQg6Pgl2s5533V5qjEI",
  authDomain: "coder-bay-fee9d.firebaseapp.com",
  databaseURL: "https://project01-concert-bud.firebaseio.com/",
  storageBucket: "coder-bay-fee9d.appspot.com"
};

firebase.initializeApp(config);
var dataRef = firebase.database();


var person = {
    name : "",
    email : 0,
    phone : 0,
    city :""
};

var customEvent = {
    artist : "",
    venue : "",
    date : ""
};

//========================== Retriving Data From DataBase ====================

//dataRef.ref().on("child_added", function(childSnapshot) {
//
//      
//     
////      $("#full-member-list").append("<div class='well'><span id='name'> " + childSnapshot.val().name +
////        " </span><span id='email'> " + childSnapshot.val().email +
////        " </span><span id='age'> " + childSnapshot.val().age +
////        " </span><span id='comment'> " + childSnapshot.val().comment + " </span></div>");
////
////    // Handle the errors
//    }, function(errorObject) {
//      //console.log("Errors handled: " + errorObject.code);
//    });

//============================= Sign-Up Input Validator ================================
//jQuery.validator.setDefaults({
//  debug: true,
//  success: "valid"
//});
//$( "#signUpForm" ).validate({
//    rules: {
//        emailInput : {
//            required: true,
//            email: true
//        }                     
//    }
//});
//============================= SignUp Function =============================
$("#signUpButton").on("click", function() {
        $("#signUpButton").hide();
        $("#signUpForm").css("opacity", "1");

 });

$("#submit").on("click", function(event) {
    event.preventDefault();
     
    person.name = $("#nameInput").val().trim();
    person.email = $("#emailInput").val().trim();
    person.phone = $("#phoneNumberInput").val().trim();
    person.city = $("#cityInput").val().trim();
    
    dataRef.ref().child("persons").push({
        name:   person.name,
        email:  person.email,
        phone:  person.phone,
        city:   person.city
    }); //-----CLOSE PUSH ----
    location.href = "index.html";
   // window.location.href = "index.html";
});//-----CLOSE SUBMIT -------

//============================== Client Event Input ==========================

$("#customEvent-submitButton").on("click", function(event){
    event.preventDefault();
  
    customEvent.artist = $("#clientEvent-artist-input").val().trim();
    customEvent.venue = $("#clientEvent-venue-input").val().trim();
    customEvent.date = $("#clientEvent-date-input").val().trim();
    
    dataRef.ref().child("customEvent").push({
        artist : customEvent.artist ,
        venue : customEvent.venue ,
        date : customEvent.date 
    }); //-----CLOSE PUSH ----
    $(".form-control").val("");
});//-----CLOSE SUBMIT -------

//============================= Search for Event (Eventful Api) ================

$("#eventSearch-submit-Btn").on("click", function(event){
    event.preventDefault();

    var venue = $("#venue-input").val().trim();
    var distance = $("#radious-input").val().trim();
    var startYear = $("#dateFrom-input").val().trim();
    var endYear = $("#dateTo-input").val().trim();
    $(".event-search").hide();
    $("#findHead").text("TOP RESULTS");

    ///================================ search result page change ================
    var articleCounter = 0;

    $("#well-section").empty();

  

    ///===========================================================================

     var apiKey = "tpx4FM5B5ftptgTf";
     var queryURL = 
        "http://api.eventful.com/json/events/search"

     queryURL += '?' + $.param ({
        'app_key': apiKey,
        'q': "music",
        'location': venue,
        'within': distance,
        'date':  "Next week",
        'page_size': 10,
        'sort_order': "relevance"
     });

     $.ajax({
        url: queryURL,
        method: "GET", 
        dataType: "jsonp" 
     }).done(function(response) {

         var results = response.events;

         console.log(results);
         console.log(results.event[0].postal_code);         
         console.log(results.event[0].title);

         for(var i =0 ; i< results.event.length; i++){

        //--------------------
        articleCounter=i;

        //---------------
             
        //=============
             
        var wellSection = $("<div>");
        wellSection.addClass("well col-md-4 col-sm-6 col-xs-8");
        wellSection.attr("id", "article-well-" + articleCounter);
             
            // =============
         $("#well-section").append(wellSection);
         $("#article-well-" + articleCounter).append("<div class='titleBar'><h5 >"+results.event[i].title+"</h5></div><br>");

         if(results.event[i].image !== null){
            var images = results.event[i].image.medium.url;
            // var descriptions = results.event[i].description;
            console.log(images);
            $("#article-well-" + articleCounter).append("<div><img src='"+images+"'></div>");
            // $(".resultsPart").append(resultDiv);
         }else{
            $("#article-well-" + articleCounter).append("<div><img height = 128px width=128px src=assets/images/defaultImg.png></div>");
         }
          
         if(results.event[i].venue_name !== null){
            var locationName = results.event[i].venue_name;
         }else{
             locationName="";
         }
         if(results.event[i].city_name !== null){
            var locationCity = results.event[i].city_name;
         }else{
             locationCity="";
         }
         if(results.event[i].postal_code !== null){
        var locationZipCode = results.event[i].postal_code;
         }else{
             locationZipCode ="";
         }
         if(results.event[i].region_name !== null){
        var locationRegion = results.event[i].region_name;
         }else{
             locationRegion ="";
         }
         if(results.event[i].start_time !== null){
        var DateTime = results.event[i].start_time;
             $("#article-well-" + articleCounter).append("<br><div class='dateTime'>Date & Time : <div>"+DateTime+"</div></div>");
         }
             
         $("#article-well-" + articleCounter).append("<br><div class='locCity'>location : <div>"+locationName+"<br>"+locationCity+" "+locationZipCode+", "+locationRegion+"</div></div>");
             
         $("#article-well-" + articleCounter).append("<br><div class='eventFull'><a href='"+results.event[i].url+"' target='_blank'>More Information <br>& Buy Tickets</a><div><br>");    
        
         $("#article-well-" + articleCounter).append("<div class='selectEvent'><button class='btn btn-default' type='button'>Select This Event</button><div><br>");
         
      
             
             
             
             
             
//            $("#article-well-" + articleCounter).append("<div><br><button class='btn btn-default' type='button'  id=>Show Description</button></div><div class='well'>"+results.event[i].description+"</div></div>"); 
//             
             
             
//            $("#article-well-" + articleCounter).append( "<div><br><button class='btn btn-primary' type='button' data-toggle='collapse.in' data-target='#collapseExample' aria-expanded='false' aria-controls='collapseExample'>"+"Show Description"+"</button><div class='collapse' id='collapseExample'><div class='well'>"+"hgashagsfhjgszxc zhxc"+"</div></div></div>");
         
             
             
             
         }
         
    });
});


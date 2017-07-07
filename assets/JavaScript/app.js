



var config = {
    apiKey: "AIzaSyB2Sjp80qQbJxcyfG1nEi9pl6S5vYF1ojg",
    authDomain: "project01-concert-bud.firebaseapp.com",
    databaseURL: "https://project01-concert-bud.firebaseio.com",
    projectId: "project01-concert-bud",
    storageBucket: "project01-concert-bud.appspot.com",
    messagingSenderId: "610385237565"
};

firebase.initializeApp(config);


var dataRef = firebase.database();

var person = {
    name : "",
    email : 0,
    pass : "",
    events :""
};
var user = {
    name : "",
    email : "",
    pass : ""
};

var event = {
    id : 0,
    latitude:0,
    longtitude:0
};
var userEvents=[];
var userUId = "";
var latitude = 0;
var longtitude = 0;
var theResult ="";
var foundKey = "";
var userEmail = "";
//=================================== Sign up/in/out Process =================
function toggleSignIn() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }else {
        var email = document.getElementById('signInEmail').value;
        var password = document.getElementById('signInPass').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            }else {
                alert(errorMessage);
            };
            console.log(error);
        });
    };
};
//======================= handle Sign Up Function =================
function handleSignUp() {
    var email = document.getElementById('signUpEmail').value;
    var password = document.getElementById('signUpPass').value;
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    };
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    };
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        }else {
            alert(errorMessage);
        };
        console.log(error);
    });
};
//======================= initApp Function =================
function initApp() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            document.getElementById('quickstart-sign-in').textContent = 'Sign out';

            console.log(displayName);
            console.log(email);
            console.log(emailVerified);
            console.log(photoURL);
            console.log(isAnonymous);
            console.log(uid);
            console.log(providerData);

            location.href = "search.html";
        }else {
          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          console.log("signed out");
        };
        //document.getElementById('quickstart-sign-in').disabled = false;
    });
    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
};
//======================= initApp2 Function =================
function initApp2() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            //document.getElementById('quickstart-sign-in').textContent = 'Sign out';

            console.log(displayName);
            console.log(email);
            console.log(emailVerified);
            console.log(photoURL);
            console.log(isAnonymous);
            console.log(uid);
            console.log(providerData);

            userUId = user.uid;
            userEmail = user.email;
            checkExistingUser();
            //  addAccount();
            //  checkUsernameSignIn();
            //  location.href = "index.html";
        }else {
          //document.getElementById('quickstart-sign-in').textContent = 'Sign in';
            location.href = "index.html";
        };
        //document.getElementById('quickstart-sign-in').disabled = false;
    });
    document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignIn, false);
    // document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignIn, false);
    // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
};
//======================= initApp3 Function =================
function initApp3() {
      firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var displayName = user.displayName;
            var email = user.email;
            var photoURL = user.photoURL;
            var uid = user.uid;

            userUId = user.uid;
            userEmail = user.email;
            showMap(userUId);

        }else {
           location.href = "index.html";
        }
      });
      document.getElementById('quickstart-sign-out').addEventListener('click', toggleSignIn, false);
};
//==================== Setting Up Variables For Next Page ==============
function checkExistingUser(){
    console.log(userUId);
    var rootRef = dataRef.ref("Accounts");
    rootRef.child(userUId).once("value").then(function(data){
    var user = data.exists();
        console.log(user);
        if(!user){
            addAccount();
        }else{
            loadUserEvents(userUId);
        }
    });
};
//=====================  =============
function addAccount(){
    var addRef = dataRef.ref("Accounts/"+userUId);
    addRef.set({
        email : userEmail,
        event : ""
    });
    console.log("added");
};
//================= edit ======================
function addEvent(theResult, eventCounter){
    var upd = dataRef.ref().child("Accounts/"+userUId).child("event");
    upd.push(theResult.event[eventCounter]);
    loadUserEvents(userUId);
};
//==============================
function loadUserEvents(userUId){
    var image = "assets/images/defaultEvent1.png"
    $("#well-s2").empty();
    var query = dataRef.ref("Accounts/").child(userUId+"/event").orderByKey();
    var counter=0;
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        userEvents.push(childSnapshot.val());
        var eventLoad = $("<div>");
        eventLoad.addClass("well col-xs-12");
        eventLoad.attr("id", "art-well-"+counter );
        $("#well-s2").append(eventLoad);   
        $("#art-well-" + counter).append("<div class='test col-xs-12'><h4>"+childData.title+"</h4></div>"); 
        if(childData.image){
            $("#art-well-" + counter).append("<div class='imageHolder col-xs-6'><img src="+childData.image.medium.url+"></div>"); 
        }else{
            $("#art-well-" + counter).append("<div class='imageHolder col-xs-6 '><img height = 128px width=128px src='"+image+"'></div>");
        };
        $("#art-well-" + counter).append("<div class='locationHolder col-xs-6 '>"+childData.city_name+", "+childData.region_name+"<br>"+childData.start_time+"<br><br>"+"<div><button class='btn btn-default' id='showMap' value='"+childData.id+"'>Show On Map</button></div></div>");
        counter++;
        });
    });
};
//===================== resultDisplay Function ======================
function resultDisplay(results, floor){
    var ceil = floor+9;
    console.log(results);
    console.log(results.event[0].postal_code);         
    console.log(results.event[0].title);
    if(results.event.length < 10){
        ceil = results.event.length; 
    };
    if(results.event.length < ceil){
        ceil = results.event.length;
    };
    for(var i = floor ; i < ceil ; i++){
        articleCounter=i;
        if(results.event[i].title !== null){
            var title = results.event[i].title;
        }else{
            var title = "No Title";
        }
        if(results.event[i].image !== null){
            var images = results.event[i].image.medium.url;
        }else{
            var images = "assets/images/defaultEvent1.png";
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
        
        var location = "<div>Location : <br>"+locationName+"<br>"+locationCity+", "+locationRegion+locationZipCode+"</div>";
        
        if(results.event[i].start_time !== null){
            var dateTime = results.event[i].start_time; 
        }else{
            dateTime = "";
        }
        if(results.event[i].url !== null){
            var websiteUrl = "<div class='eventFull'><a href='"+results.event[i].url+"' target='_blank'>More Information <br>& Buy Tickets</a><div>";
        }else{
            var websiteUrl = "";
        }   
        if(results.event[i].description !== null){
            var description = results.event[i].description;
        }else{
            var description = "No Data Is Available";
        }
        var wellSection = $("<div>");
        wellSection.addClass("well col-xs-12");
        wellSection.attr("id", "article-well-" + articleCounter);
        $("#well-section").append(wellSection);   
        $("#article-well-" + articleCounter).append("<div class='test col-xs-12'><h4>"+title+"</h4></div>"); 
        if(results.event[i].image !== null){
            $("#article-well-" + articleCounter).append("<div class='imageHolder col-xs-6 col-sm-4'><img src='"+images+"'></div>"); 
        }else{
            $("#article-well-" + articleCounter).append("<div class='imageHolder col-xs-6 col-sm-4'><img height = 128px width=128px src="+images+"></div>");
        } 
        $("#article-well-" + articleCounter).append("<div class='locationHolder col-xs-6 col-sm-4'>"+location+"</div>");
        $("#article-well-" + articleCounter).append("<div class='dateHolder col-xs-6 col-sm-4'>Date & Time : <br>"+dateTime+"</div>");
        $("#article-well-" + articleCounter).append("<div class='linkHolder col-xs-6 col-sm-8'>"+websiteUrl+"</div>");    
        $("#article-well-" + articleCounter).append("<div class='selectEvent col-xs-6 col-sm-12'><button class='btn btn-default' id='selectEventBtn' value='"+articleCounter+"' type='button'>Select This Event</button><div>"); 
        $("#article-well-" + articleCounter).append("<div class='descriptionHolder col-xs-12'><strong>Description :</strong> <br>"+description+"<div>"); 
    };
};
//<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'><div class='panel panel-default'><div class='panel-heading' role='tab' id=headingOne'><h4 class='panel-title'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>Collapsible Group Item #1</a></h4></div><div id='collapseOne' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='headingOne'><div class='panel-body'></div></div></div></div></div>
//=============================== showMap Function ===============================
function showMap(foundKey){
    thisId = sessionStorage.getItem("id");
    var userRef = dataRef.ref("Accounts/").child(foundKey).child("event");
    userRef.orderByChild("id").equalTo(thisId).on("child_added", function(data) {
//
//        console.log("correct : " + data.val().id);
//        console.log(data.val().latitude);
//        console.log(data.val().longitude);
//        console.log(data.val().title);
//        console.log(data.val().venue_name);
//        console.log(data.val().description);
//        console.log(data.val().url);

        latVal =        data.val().latitude;
        longVal =       data.val().longitude;
        title =         data.val().title;
        venueName =     data.val().venue_name;
        description =   data.val().description;
        url =           data.val().url;
//        console.log("Here is the new one");    
//        console.log(latVal);
//        console.log(longVal);
//        console.log(title);
//        console.log(venueName);
//        console.log(description);
//        console.log(url);
        
        function initMap() {
            var latitude = parseFloat(latVal)
            console.log(latitude);
            var longitude = parseFloat(longVal)
            console.log(longitude);
            var uluru = {lat:latitude, lng: longitude};
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
        }

        $(".event-select-display").html("<h2>" + title + "</h2>" + "<h4>" + venueName + "</h4>"
        + "<img src='assets/images/defaultImg2.png' width=70%> <br> <br> " + "<p>" + description + "</p> "
        +"<a href='" + url + "' target='_blank'> MORE INFO </a>");

        initMap();
    });
};
//============================= Plug In Function =============================
$("#plugInButton").on("click", function() {
    $("#plugInButton").hide();
    $(".signing-section").show();
    $(".forms").val("");
});
//=============================== Back to Search =================================
$("#backToSearch").on("click", function(event){
    event.preventDefault();
    $(".result-bar").hide();
    $("#well-section").empty();
    $(".btn-group").empty();
    $(".event-search").show();
});
////============================= Search for Event (Eventful Api) ================
$("#eventSearch-submit-Btn").on("click", function(event){
    event.preventDefault();
    
    var venue = $("#venue-input").val().trim();
    var category = $("#category-input").val().trim();
    var distance = $("#radious-input").val().trim();
    var date = $("#select").val().trim();
    if(venue !== ""){
        
        if(category === ""){
            category = "concert";
        };
        
        $(".event-search").hide();
        $("#findHead").text("TOP RESULTS");
        //search result page change ================
        var articleCounter = 0;
        var results = 0;
        var resultSize = 0;
        var resultPage = 0;
        var floor = 0;
        $("#well-section").empty();

        var apiKey = "tpx4FM5B5ftptgTf";
        var queryURL = "http://api.eventful.com/json/events/search";
    
        queryURL += '?' + $.param ({
            'app_key': apiKey,
            'q': category,
            'location': venue,
            'within': distance,
            'date':  date,
            'page_size': 100,
            'sort_order': "relevance"
        });

        $.ajax({
            url: queryURL,
            method: "GET", 
            dataType: "jsonp" 
        }).done(function(response) {
            if (response.total_items > 0){
                results = response.events;
                theResult = results;
                resultPage = Math.ceil(response.total_items/10);
                resultSize = results.event.length;
                $("#result-number").text(response.total_items +" Results Found"); 
                $(".result-bar").show();
                //Populating Page with resultDisplay function ==============  
                resultDisplay(results, floor);
            }else{
                $("#result-number").text("No Result Found !!"); 
                $(".result-bar").show();
            }
            //providing Event Page Selector Btns at the end of the dispaly section 
            if(resultSize > 10){
                for(var i = 1 ; i <= resultPage ; i++){
                    var btnSection = $("<button>");
                    btnSection.addClass("btn btn-default btnG");
                    btnSection.attr("id", "btn-" + i);
                    btnSection.attr("type", "radio");
                    btnSection.attr("autocomplete", "off");
                    btnSection.val(i);
                    btnSection.text(i);
                    $(".btn-group").append(btnSection);
                };
            };
            // Event Page Selector Btns Behavior 
            $(document).on("click", ".btnG", function() {
                event.preventDefault();
                for(var i = 1; i <= resultPage; i++){
                    $(".btnG").removeClass("active");
                };
                $(this).addClass("active");
                var ceilIndex = $(this).val();
                floor = (ceilIndex*10)-10;
                console.log(floor);
                $("#well-section").empty();
                resultDisplay(results, floor);
            });
        });
    };
});
////===================== Select Event Button Function =============
$(document).on("click", "#selectEventBtn", function() {
    event.preventDefault();
    console.log($(this).val());
    var eventCounter = $(this).val();
    $("#well-section2").empty();
    addEvent(theResult, eventCounter);
}); 
////==================== ShowMap =====================
$(document).on("click", "#showMap", function() {
    event.preventDefault();
    console.log($(this).val());
    var thisId =$(this).val();
    sessionStorage.setItem("id", thisId);
    location.href = "event.html";
});
////===================== Result Display ============================




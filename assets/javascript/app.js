$(document).ready(function() {
   

  var config = {
    apiKey: "AIzaSyCmWJFwojgpEVrH_4EtcT-ICKZ00MvoktE",
    authDomain: "trainscheduler-2fa2d.firebaseapp.com",
    databaseURL: "https://trainscheduler-2fa2d.firebaseio.com",
    projectId: "trainscheduler-2fa2d",
    storageBucket: "trainscheduler-2fa2d.appspot.com",
    messagingSenderId: "910349351632"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

  $("#add-train").on("click",function(){
      event.preventDefault();

      var trainName = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var trainTime = $("#time-input").val().trim();
      var frequency = $("#frequency-input").val().trim();

     
var newTrain = {
    newTrainName:trainName,
    newDestination:destination,
    newTrainTime:trainTime,
    newFrequency:frequency,
    dataAdded: firebase.database.ServerValue.TIMESTAMP
};

database.ref().push(newTrain);

    $("#train-name-input, #destination-input, #time-input, #frequency-input").val("");

  });

  database.ref().on("child_added", function(snapshot){

    var trainName = snapshot.val().newTrainName;
    var destination = snapshot.val().newDestination;
    var trainTime = snapshot.val().newTrainTime;
    var frequency = snapshot.val().newFrequency;
    var timeStamp = snapshot.val().dataAdded;

    var convertedTime = moment(trainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var timeDifference = moment().diff(moment(convertedTime), "minutes")
    var timeLeft = timeDifference % frequency
    var minutes = frequency - timeLeft
    var arrival = moment().add(minutes, "minutes");

    var createNewRow = $("<tr>").append(
        $("<td scope='col'>").text(trainName),
        $("<td scope='col'>").text(destination),
        $("<td scope='col'>").text(frequency),
        $("<td scope='col'>").text(moment(arrival).format("hh:mm")),
        $("<td scope='col' class='minutes-away'>").text(minutes),
        $("<td scope='col'> <button type='button' class = 'btn btn-default btn-sm' data-entry='" + snapshot.entry + "'> <i class='fa fa-trash' style='color:red'></i></button></td>")
    )

    $("#trainInfo").append(createNewRow)

  });

$(document).on('click', '.btn-sm', function(){
    database.ref($(this).data('entry')).remove();
    $(this).parent().parent().remove();
    console.log($(this).parent().parent())
    alert("Train has been deleted!")

});



  setInterval(function(){
      $("#current-time").html(moment().format('hh:mm:ss'))
},1000);

  });

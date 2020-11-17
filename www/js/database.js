$(window).on("orientationchange", function(e) {
    alert(e.orientation);
});
var db = window.openDatabase("iRated", "1.0", "iRated", 200000);
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    $(document).on("deviceready", onDeviceReady);
    $(document).on("pageshow", "#page-create", setRating);
    $(document).on("vclick", "#btn-upload", TakePictures);
} else {
    onDeviceReady();
    TakePictures();
    setRating();

}

function transError(tx, err) {
    console.log(err);

}

function onDeviceReady() {
    db.transaction(function(tx) {
        //restaurant
        var query = "CREATE TABLE IF NOT EXISTS Restaurant(Id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "Image BLOB," +
            "Name TEXT NOT NULL UNIQUE," +
            "Price TEXT NOT NULL," +
            "Date TEXT NOT NULL," +
            "Location TEXT NOT NULL," +
            "Types TEXT NOT NULL," +
            "Service REAL," +
            "Cleanliness REAL," +
            "Food REAL" +
            ")";

        tx.executeSql(query, [], function() {
            alert("Create TABLE Restaurant successfully!");
        }, transError);
        //note
        var query = "CREATE TABLE IF NOT EXISTS Note (Id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "Note TEXT NOT NULL," +
            "Restaurant_Id INTEGER NOT NULL," +
            "FOREIGN KEY (Restaurant_Id) REFERENCES Restaurant (Id)" + ")";
        tx.executeSql(query, [], function() {
            alert("Create TABLE Quote successfully!");
        }, transError);
    });

}

function TakePictures() {
    navigator.camera.getPicture(onSuccess, onFail, {
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        // Display taken image.
        $("#page-create #image").attr("src", "data:image/jpeg;base64," + imageData);

    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function insertRestaurant(restaurant) {
    db.transaction(function(tx) {
        var img = $("#page-create #image").attr("src");
        var query = `INSERT INTO Restaurant (Image, Name, Price, Date, Location, Types, Service ,Cleanliness, Food ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        tx.executeSql(query, [img, restaurant.Name, restaurant.Price, restaurant.Date, restaurant.Location, restaurant.Types, restaurant.Service, restaurant.Cleanliness, restaurant.Food], function() {
            alert(`Create new restaurant ${restaurant.Name} successfully!`);
        }, transError);
    });

}


$(document).on("submit", "#frm-create", function(e) {
    e.preventDefault();

    $("#page-create #frm-confirm #name").text($("#page-create #frm-create #name").val());

    $("#page-create #frm-confirm #price").text($("#page-create #frm-create #price").val());

    $("#page-create #frm-confirm #location").text($("#page-create #frm-create #location").val());

    $("#page-create #frm-confirm #date").text($("#page-create #frm-create #date").val());

    $("#page-create #frm-confirm #type").text($("#page-create #frm-create #type").val());

    parseFloat($("#page-create #frm-confirm #rating-service-point").text($("#page-create #frm-create #rating-service-point").text()));

    parseFloat($("#page-create #frm-confirm #rating-clean-point").text($("#page-create #frm-create #rating-clean-point").text()));

    parseFloat($("#page-create #frm-confirm #rating-food-point").text($("#page-create #frm-create #rating-food-point").text()))

    $("#page-create #frm-confirm").popup("open");



});

$(document).on("submit", "#frm-confirm", function(e) {
    e.preventDefault();
    var restaurant = {
        "Name": $("#page-create #frm-confirm #name").text(),
        "Price": $("#page-create #frm-confirm #price").text(),
        "Location": $("#page-create #frm-confirm #location").text(),
        "Date": $("#page-create #frm-confirm #date").text(),
        "Types": $("#page-create #frm-confirm #type").text(),
        "Service": parseFloat($("#page-create #frm-confirm #rating-service-point").text()),
        "Cleanliness": parseFloat($("#page-create #frm-confirm #rating-clean-point").text()),
        "Food": parseFloat($("#page-create #frm-confirm #rating-food-point").text())
    }


    insertRestaurant(restaurant);

    $("#page-create #frm-confirm").popup("close");
    $("#page-create #frm-create").trigger("reset")

});
$(document).on("vclick", "#btn-edit", function() {
    $("#page-create #frm-confirm").popup("close");
});

function setRating() {
    /* Create stars SERVICE */
    $("#rating-service-star").rateYo().on("rateyo.change", function(e, data) {
        $("#rating-service-point").text(data.rating);
    });

    /* Create stars CLEAN */
    $("#rating-clean-star").rateYo().on("rateyo.change", function(e, data) {
        $("#rating-clean-point").text(data.rating);
    });

    /* Create stars FOOD */
    $("#rating-food-star").rateYo().on("rateyo.change", function(e, data) {
        $("#rating-food-point").text(data.rating);
    });
}

function showRestaurant() {

}
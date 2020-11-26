$(window).on("orientationchange", function(e) {
    alert(e.orientation);
});
var db = window.openDatabase("iRated", "1.0", "iRated", 200000);

{
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
        $(document).on("deviceready", onDeviceReady);
        $(document).on("pageshow", "#page-create", setRating);
        $(document).on("vclick", "#btn-take", TakePictures);
        $(document).on("vclick", "#btn-upload", UploadPicture);
        $(document).on("pageshow", "#page-view-detail", listRestaurant);
        $(document).on("vclick", "#page-view-detail #lv-restaurant-list li a", function() {
            var restaurant = $(this).data("details");
            listRestaurantDetail(restaurant);

        });
        $(document).on("vclick", "#btn-update", function() {
            var restaurant_id = $(this).data("id");
            GetUpdate(restaurant_id);
        });

        $(document).on("pageshow", "#updatedialog", setRating);
        $(document).on("vclick", "#btn-retake", RetakePictures);
        $(document).on("vclick", "#btn-reupload", ReuploadPicture);
        $(document).on("vclick", "#btn-delete", deleteRestaurant);

    } else {
        onDeviceReady();
        TakePictures();
        UploadPicture();
        setRating();
        listRestaurant();
        listRestaurantDetail();
        GetUpdate();
        RetakePictures();
        ReuploadPicture();
        deleteRestaurant();
    }
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
            "Note TEXT NOT NULL," +
            "Service REAL," +
            "Cleanliness REAL," +
            "Food REAL" +
            ")";

        tx.executeSql(query, [], function() {
            alert("Create TABLE Restaurant successfully!");
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

function UploadPicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        destinationType: Camera.DestinationType.FILE_URI
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
        var query = `INSERT INTO Restaurant (Image, Name, Price, Date, Location, Types, Note, Service ,Cleanliness, Food ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        tx.executeSql(query, [img, restaurant.Name, restaurant.Price, restaurant.Date, restaurant.Location, restaurant.Types, restaurant.Note, restaurant.Service, restaurant.Cleanliness, restaurant.Food], function() {
            alert(`Create new restaurant ${restaurant.Name} successfully!`);
            window.location.replace('index.html');


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

    $("#page-create #frm-confirm #note").text($("#page-create #frm-create #note").val());

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
        "Note": $("#page-create #frm-confirm #note").text(),
        "Service": parseFloat($("#page-create #frm-confirm #rating-service-point").text()),
        "Cleanliness": parseFloat($("#page-create #frm-confirm #rating-clean-point").text()),
        "Food": parseFloat($("#page-create #frm-confirm #rating-food-point").text())
    }


    insertRestaurant(restaurant);

    $("#page-create #frm-confirm").popup("close");
    $("#page-create #frm-create").trigger("reset");


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

function listRestaurant() {
    db.transaction(function(tx) {
        var query = "SELECT * FROM Restaurant";
        tx.executeSql(query, [], listRestaurantSuccess, transError);
    });
}

function listRestaurantSuccess(tx, result) {
    $("#page-view-detail #lv-restaurant-list").empty();
    var newList = "<ul data-role='listview' id= 'lv-restaurant-list'>";

    $.each(result.rows, function(i, restaurant) {
        newList += "<li class='ui-content'><a href='#page-view-res-detail'  data-details='" + JSON.stringify(restaurant) + "'>" +
            "   <img  src='data:image/jpeg;base64" + restaurant.Image + "'style='padding-top:5px; height:99px'>" +
            "    <h3 class='ui-li-heading'>Restaurant Name: " + restaurant.Name + "</h3>" +
            "    <p class='ui-li-desc'>" + restaurant.Note + "</p>" +
            "</a></li>";
    });

    newList += "</ul>";

    $("#page-view-detail #lv-restaurant-list").append(newList).listview("refresh").trigger("create");
}


function listRestaurantDetail(restaurant) {
    $("#page-view-res-detail #header #resname").empty();
    $("#page-view-res-detail #res_info #image").empty();
    $("#page-view-res-detail #res_info #info").empty();
    $("#page-view-res-detail #res_info #rating-star").empty();
    var ratingTotal = ((restaurant.Service + restaurant.Cleanliness + restaurant.Food) / 3).toFixed(1);
    $("#page-view-res-detail #header #resname").append("<b style='font-size:30px'>" + restaurant.Name + "</b>");
    $("#page-view-res-detail #header #popupMenu #list-btn").append(`<li><button class="ui-btn" onclick="deleteRestaurant(${restaurant.Id});">Delete</button></li>`);
    $("#page-view-res-detail #header #popupMenu #list-btn").append(`<li><button class="ui-btn" id="btn-update" onclick="window.location.href='#updatedialog'" data-id="0">Update</button></li>`);



    $("#page-view-res-detail #res_info #image").append("<img src='data:image/jpeg;base64 " + restaurant.Image + "'style='width:100%'>");
    $("#page-view-res-detail #res_info #info").append("<h2 style='font-size:30px;text-align:center;'>" + restaurant.Name + "</h2>");
    $("#page-view-res-detail #res_info #info").append("<p style='text-align:center;font-size:20px'> " + restaurant.Location + "</p>");
    $("#page-view-res-detail #res_info #info").append("<p style='text-align:center;font-size:20px'> " + restaurant.Price + "</p><hr>");
    $("#page-view-res-detail #res_info #info").append("<p>Note: " + restaurant.Note + "</p><hr>");





    parseFloat($("#page-view-res-detail #res_info #rating-star").append("<tr><th>Service:</th><td id='total-rating-service-star'></td> <td> " + restaurant.Service + " </td>  </tr>"));
    parseFloat($("#page-view-res-detail #res_info #rating-star").append("<tr> <th>Cleanliness:</th><td id='total-rating-cleanliness-star'></td> <td> " + restaurant.Cleanliness + " </td>  </tr>"));
    parseFloat($("#page-view-res-detail #res_info #rating-star").append("<tr> <th>Food:</th><td id='total-rating-food-star'></td> <td> " + restaurant.Food + " </td>  </tr>"));
    parseFloat($("#page-view-res-detail #res_info #rating-star").append("<tr> <th>Total:</th><td id='total-rating-star'></td> <td> " + ratingTotal + " </td>  </tr>"));

    $("#total-rating-service-star").rateYo({
        rating: restaurant.Service,
        readOnly: true
    });
    $("#total-rating-cleanliness-star").rateYo({
        rating: restaurant.Cleanliness,
        readOnly: true
    });
    $("#total-rating-food-star").rateYo({
        rating: restaurant.Food,
        readOnly: true
    });
    $("#total-rating-star").rateYo({
        rating: ratingTotal,
        readOnly: true
    });

    $("#btn-update").attr("data-id", restaurant.Id);

}

function RetakePictures() {
    navigator.camera.getPicture(onSuccess, onFail, {
        destinationType: Camera.DestinationType.DATA_URL
    });

    function onSuccess(imageData) {
        // Display taken image.
        $("#updatedialog #image").attr("src", "data:image/jpeg;base64," + imageData);

    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function ReuploadPicture() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        destinationType: Camera.DestinationType.FILE_URI
    });

    function onSuccess(imageData) {
        // Display taken image.
        $("#updatedialog #image").attr("src", "data:image/jpeg;base64," + imageData);

    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function UpdateRestaurant(restaurant) {
    var img = $("#updatedialog #image").attr("src");
    db.transaction(function(tx) {
        var query = `UPDATE Restaurant SET Image = ?, Name =?, Price=?, Date=?, Location=?, Types=?, Note=?, Service=?, Cleanliness=?, Food=?  WHERE Id=?`;
        tx.executeSql(query, [img, restaurant.Name, restaurant.Price, restaurant.Date, restaurant.Location, restaurant.Types, restaurant.Note, restaurant.Service, restaurant.Cleanliness, restaurant.Food, restaurant.Id], function() {
            alert(`Update the restaurant successfully!`);
        }, transError);

    });
}


function GetUpdate(restaurant_id) {
    db.transaction(function(tx) {
        var query = `SELECT * FROM Restaurant WHERE Id = ${restaurant_id}`;
        tx.executeSql(query, [], GetUpdateSuccess, transError);
    });
}

function GetUpdateSuccess(tx, result) {
    var restaurant = result.rows.item(0);


    $("#updatedialog #frm-update #image").attr("src", restaurant.Image);
    $("#updatedialog #frm-update #name").val(restaurant.Name);
    $("#updatedialog #frm-update #price").val(restaurant.Price);
    $("#updatedialog #frm-update #location").val(restaurant.Location);
    $("#updatedialog #frm-update #date").val(restaurant.Date);
    $("#updatedialog #frm-update #type").val(restaurant.Types);
    $("#updatedialog #frm-update #note").val(restaurant.Note);
    parseFloat($("#updatedialog #frm-update  #rating-service-point").text(restaurant.Service));
    parseFloat($("#updatedialog #frm-update  #rating-clean-point").text(restaurant.Cleanliness));
    parseFloat($("#updatedialog #frm-update  #rating-food-point").text(restaurant.Food));
    $("#rating-service-star").rateYo({
        rating: restaurant.Service,
        WriteOnly: true
    });
    $("#rating-clean-star").rateYo({
        rating: restaurant.Cleanliness,
        WriteOnly: true
    });
    $("#rating-food-star").rateYo({
        rating: restaurant.Food,
        WriteOnly: true
    });
}




$(document).on("submit", "#frm-update", function(e) {
    e.preventDefault();
    var restaurant = {
        "Id": $("#btn-update").data("id"),
        "Image": $("#updatedialog #frm-update #image").attr("src"),
        "Name": $("#updatedialog #frm-update #name").val(),
        "Price": $("#updatedialog #frm-update #price").val(),
        "Location": $("#updatedialog #frm-update #location").val(),
        "Date": $("#updatedialog #frm-update #date").val(),
        "Types": $("#updatedialog #frm-update #type").val(),
        "Note": $("#updatedialog #frm-update #note").val(),
        "Service": parseFloat($("#updatedialog #frm-update #rating-service-point").html()),
        "Cleanliness": parseFloat($("#updatedialog #frm-update #rating-clean-point").html()),
        "Food": parseFloat($("#updatedialog #frm-update #rating-food-point").html())

    }
    UpdateRestaurant(restaurant);
    $("#updatedialog").dialog("close");



});

function deleteRestaurant(id) {
    db.transaction(function(tx) {
        var query = `DELETE FROM Restaurant WHERE Id=${id}`;
        tx.executeSql(query, [], function() {
            alert(`Delete successfully`);
            window.location.replace('viewdetail.html');
            $("#page-view-detail #lv-restaurant-list").listview("refresh");
        }, transError);
    });
}
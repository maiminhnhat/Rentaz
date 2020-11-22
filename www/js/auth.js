// document.getElementById("login").addEventListener("click", SignIn, false)
$(document).on("vclick", "#login", SignIn);
// document.getElementById("logout").addEventListener("click", SignOut, false)
$(document).on("vclick", "#logout", SignOut);
/**
 * Handles the sign in button press.
 */
function SignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(function() {
        return firebase.auth().getRedirectResult();
    }).then(function(result) {
        // This gives you a Google Access Token.
        // You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...

    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });

    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token.
            // You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...

        }
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });


}

function SignOut() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });
}

function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log(user.photoURL)
                // User is signed in.
            var displayName = user.displayName;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var providerData = user.providerData;
            $("#login").hide();
            $("#logout").show();
            document.getElementById("userimg").setAttribute("src", photoURL);
            document.getElementById("username").innerHTML = displayName;
            $("#card").show();
            $("#post-contain").show();
            $("#login-contain").hide();
        } else {
            // User is signed out.
            $("#login").show();
            $("#card").hide();
            $("#logout").hide();
            $("#post-contain").hide();
            $("#login-contain").show();


        }

    });
    // [END authstatelistener]

}
window.onload = function() {
    initApp();
};
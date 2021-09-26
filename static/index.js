function letterNumber() {
    var specialChars = /[^a-zA-Z0-9 ]/g;
    if (document.signup.username.value.match(specialChars) || document.signup.firstname.value.match(specialChars) ||
        document.signup.surname.value.match(specialChars) || document.signup.password.value.match(specialChars))
    {
        alert ("Only characters A-Z, a-z and 0-9 are allowed!")
        document.actorInsert.actInsert.focus();
        return false;

    }
    return true;
}


function commentsUpdate() {

    var com = document.getElementById("com").value;
    var img = document.getElementById("myImg").name;
    var commentsInfo = document.getElementById("comments");

    var val = commentsInfo.innerText;
    console.log(val);

    if(com) {
        $.ajax({
            url: "/comments",
            method: "POST",
            type: 'POST',
            data:{
                userComment: com,
                imgName : img,
            },
            success: function (respond) {
                console.log("Hi from ajax-comments");
                let htmlString = "<p>" + respond + "</p>";
                if (val === "No comments yet for this photo") {
                    commentsInfo.innerText = "";
                    commentsInfo.insertAdjacentHTML("beforeend", htmlString);
                    document.getElementById("com").value = null;
                } else {
                    commentsInfo.insertAdjacentHTML("beforeend", htmlString);
                    document.getElementById("com").value = null;
                }

            }
        });
    }
}

function likesUpdate() {
    document.getElementById("likes").style.backgroundColor="red"; 
    var img = document.getElementById("myImg").name;
    if(img) {
        $.ajax({
            url: "/likes",
            method: "POST",
            type: 'POST',
            data:{
                imgName : img,
            },
            success: function (respond) {
                console.log("Hi from ajax-likes");
                document.getElementById("likesSection").innerHTML = respond;
            }
        });
    }
    console.log("Hi im working")

}
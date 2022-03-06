$(document).ready(function(e){
    $("#rep_story_detail").on("click", function(e){
        var url = getDomain() + "/peter_bluewire/customer-portal/#Page:Reputation_Story?loginUserEmail=cchaleman@bluewire.ai";
        window.open(url, "_parent");
    });
});

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}

function displayData(reputation_data ){
    var date = new Date(reputation_data.Reputation_Story_Update_Date);
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    var months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var str_date = "UPDATED " + months[month] + " " + day + ", " + year;
    $("#updated_date").html(str_date );
    $("#reputation_content").html(reputation_data.Reputation_Story_Short_Description);
}
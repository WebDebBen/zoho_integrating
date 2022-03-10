
$(document).ready(function(){
    modal_hide();

    $("#champion_block").on("click", function(e){
        e.preventDefault();
        modal_show();
    });

    $("#overlay-wrap").on("click", function(e){
        e.preventDefault();
        modal_hide();
    });

    $(".modal-close").on("click", function(e){
        e.preventDefault();
        modal_hide();
    });

    $("#meet-link").on("click", function(e){
        e.preventDefault();
        window.open($(this).attr("data-href"), "_blank");
    });

    $("#resources_block").on("click", function(e){
        e.preventDefault();
        window.open(getDomain() + "/peter_bluewire/customer-portal/#Page:Resources_S?loginUserEmail=" + user_email, "_parent");
    });

    $("#bluewire_block").on("click", function(e){
        window.open("https://connect.bluewire.ai/", "_blank");
    });

});

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}

function displayUserProfile(data ){
    if (data && data.length  > 0){
        data = data[0];
        $("#contact-email").attr("href", "mailto:" + data.Email);
        $("#contact-phone").html(data.Phone_Number);
        $("#resources_block").attr("data-email", data.Email );
        $("#meet-link").attr("data-href", data.Meeting_Link );
    }
}

function modal_show(){
    $("#overlay-wrap").show();
    $("#account-modal").show();
}

function modal_hide(){
    $("#overlay-wrap").hide();
    $("#account-modal").hide();    
}
function displayUserInfo(data ){
    if (data.length == 0 ) return;

    data = data[0];
    $(".user_photo_img").attr("src", "https://creatorapp.zoho.com/" + data.Profile_Photo );
    $(".user_fullname").html(data.Name.display_value );
    $(".user_email").html(data.Email );
    $(".user_nickname").html(data.User_Type );
    if (data.Country_Region != "" ){
        //<img src="imgs/usa.png" class="flag_img">
        $("<span>").html(data.Country_Region).appendTo($(".user_country_region"));
    }
    if (data.Language != ""){
        $(".user_lang").html(data.Language);
    }
    if (data.Timezone != ""){
        $(".user_timezone").html(data.Timezone);
    }
    $("#profile_edit_btn").attr("data-href",
        "https://app.zohocreator.com/peter_bluewire/customer-portal/#Form:Users?recLinkID=" + data.ID +
        "&viewLinkName=All_Users&zc_NextUrl=https://creatorapp.zoho.com/peter_bluewire/customer-portal/#Page:Admin_Panel");

    $("#profile_edit_btn").on("click", function(e){
        window.open($(this).attr("data-href"), "_parent");
    })
}
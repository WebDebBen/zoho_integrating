var data = [
    {
        state: "lapse",
        title: "DOQs",
        dot_date: "Connection in progress. Start date: November 22,2021",
        dot_state_type: "close",
        details: [
            {
                state: "off",
                id: "12345678",
                date: "Expired November 12,2021",
                resolve: true
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            
        ]
    },
    {
        state: "expiring",
        title: "DOQs",
        dot_date: "Connection in progress. Start date: November 22,2021",
        dot_state_type: "close",
        details: [
            {
                state: "off",
                id: "12345678",
                date: "Expired November 12,2021",
                resolve: true
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            
        ]
    },
    {
        state: "actived",
        title: "DOQs",
        dot_date: "Connection in progress. Start date: November 22,2021",
        dot_state_type: "check",
        details: [
            {
                state: "off",
                id: "12345678",
                date: "Expired November 12,2021",
                resolve: true
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            
        ]
    },
    {
        state: "not-actived",
        title: "DOQs",
        dot_date: "Connection in progress. Start date: November 22,2021",
        dot_state_type: "check",
        details: [
            {
                state: "off",
                id: "12345678",
                date: "Expired November 12,2021",
                resolve: true
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            
        ]
    },
    {
        state: "progressing",
        title: "DOQs",
        dot_date: "Connection in progress. Start date: November 22,2021",
        dot_state_type: "arrow-rotate-right",
        details: [
            {
                state: "off",
                id: "12345678",
                date: "Expired November 12,2021",
                resolve: true
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            {
                state: "on",
                id: "12345678",
                date: "Expired November 12,2021",
            },
            
        ]
    }
];

var g_channel, g_channel_result;

$(document).ready(function(){
    $(".dot-block").remove();
    modal_hide();
    $('.pie_progress').asPieProgress({
        namespace: 'pie_progress',
        barsize: '8',
        barcolor: '#2BD788',
    });

    $("#dot_dropdown").on("change", ".dot", function(e){
        e.preventDefault();
        displayChannels(g_channel, g_channel_result );
    });

    $("#btn-profile").on("click", function(){
        modal_show();
    });
    $("#overlay-wrap").on("click", function(e){
        e.preventDefault();
        modal_hide();
    });
    $(".modal-close").on("click", function(e){
        e.preventDefault();
        modal_hide();
    })
});

function getChannelResultItems(channel, channel_result, dots ){
    var items = [];
    for (var i = 0; i < channel_result.length; i++ ){
        if (dots.length > 0 ){
            if (channel.ID == channel_result[i].Bluewire_Data_channels.ID && dots.indexOf(channel_result[i].DOT.ID) == 0){
                items.push(channel_result[i]);
            }
        }else{
            if (channel.ID == channel_result[i].Bluewire_Data_channels.ID ){
                items.push(channel_result[i]);
            }
        }
    }
    return items;
}

function getSelectedDots(){
    var inputs = $("#dot_dropdown input");
    var dots = [];
    for(var i = 0; i < inputs.length;i++){
        if ($(inputs[i]).is(":checked")){
            dots.push($(inputs[i]).attr("data-val"));
        }
    }
    return dots;
}

function getStatus(last_updated, status, expiration_date ){
    status = status.toLowerCase();
    var now_date = new Date();
    var exp_date = new Date(expiration_date);
    var sub_day = (exp_date - now_date) / 1000 / 3600 / 24;
    if (status == "activated"){
        if (sub_day > 0 && sub_day < 7){
            return {label: "Expiring " + expiration_date, class: "expiring", dot_state_type: "close"};
        }else if(sub_day < 0){
            return {label: "Data Lapse " + expiration_date, class: "lapse", dot_state_type: "close"};
        }else{
            return {label: "Last Update " + last_updated, class: "actived", dot_state_type: "check"};
        }
    }else if (status == "onboarding in progress"){
        return {label: "Connection in Progress, Start date " + expiration_date, class:"progressing", dot_state_type: "arrow-rotate-right"};
    }
    return {label: "Inactive", class: "not-actived", dot_state_type: "check"};
}

function displayChannels(channels, channel_result){
    g_channel = channels;
    g_channel_result = channel_result;
    $("#dot-container").html("");
    var active_channel = 0;
    var dots = getSelectedDots();
    var total_count = 0;
    for (var i = 0; i < channels.length; i++ ){
        total_count++;
        var channel = channels[i];
        var result = getChannelResultItems(channel, channel_result, dots );
        var status = {label: "Inactive", class: "not-actived", dot_state_type: "check"};
        var result_item = result[0];
        var title = channel.Reptile_Index_Theory_Attack_Vector.display_value + " " + channel.Ally_Name;
        if (result.length > 0 ){
            status = getStatus(result_item.Last_Updated, result_item.Status, result_item.Expiration_date );
        }
        if (status.class == "actived") active_channel++;
        var details = [];
        addDotBlock(status.class, title, status.label, status.dot_state_type, details );
    }

    var p = parseInt(active_channel / total_count * 100);
    $('.pie_progress').attr("data-goal", p).asPieProgress('go', p + '%');
}

function addDotBlock(state, title, dot_date, dot_state_type, details ){
    var parent = $("#dot-container");
    var dot_block = $("<div>").addClass("dot-block mt-1r " + state).appendTo(parent );
    var dot_item  =$("<div>").addClass("pdl-1r dot-item").appendTo(dot_block );
    var arrow_item = $("<div>")
            .addClass("hide")
            .on("click", function(e){
                e.preventDefault();
                if($(this).parent().parent().hasClass("active")){
                    $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                    $(this).parent().parent().removeClass("active");
                    $(this).parent().parent().find(".dot-detail-block").hide();
                }else{
                    $(this).find("i").addClass("fa-angle-down").removeClass("fa-angle-right");
                    $(this).parent().parent().addClass("active");
                    $(this).parent().parent().find(".dot-detail-block").show();
                }
            })
            .addClass("arrow-item").appendTo(dot_item);
    $("<i>").addClass("fa fa-angle-right").appendTo(arrow_item );
    var dot_desc = $("<div>").addClass("dot-desc").appendTo(dot_item);
    $("<div>").addClass("dot-title").html(title ).appendTo(dot_desc);
    $("<div>").addClass("dot-date").html(dot_date).appendTo(dot_desc);
    var dot_state_item  = $("<div>").addClass("dot-state-item").appendTo(dot_item );
    $("<div>").html("<i class='fa fa-" + dot_state_type + "'></i>").appendTo(dot_state_item);

    var dot_detail_block = $("<div>").addClass("dot-detail-block hide").hide().appendTo(dot_block );
    for (var i = 0; i < details.length; i++ ){
        var detail_item = details[i];
        var detail_state = detail_item["state"];
        var detail_id = detail_item["id"];
        var detail_date = detail_item["date"];
        var detail_resolve = detail_item["resolve"];

        var dot_detail_item = $("<div>").addClass("dot-detail-item").appendTo(dot_detail_block);
        var detail_state_div = $("<div>").addClass("detail-state " + detail_state ).appendTo(dot_detail_item);
        $("<div>").addClass("state-id").html(detail_id ).appendTo(detail_state_div);
        $("<div>").addClass("state-date").html(detail_date ).appendTo(detail_state_div);
        if (detail_resolve == true ){
            $("<div>").addClass("state-action")
                    .html("RESOLVE <i class='fa fa-angles-right'></i>")
                    .appendTo(detail_state_div)
        }
    }
}

function addDropDown(dotInfo ){
    var parent = $("#dot_dropdown");
    for (var i = 0;i < dotInfo.length; i++ ){
        var item = dotInfo[i];
        var name = item["Name"];
        var id = item["ID"];
        var li = $("<li>").appendTo(parent );
        var check = $("<input>").attr("type", "radio").addClass("dot check")
                .attr("name", "dot-filter")
                .attr("id", id )
                .attr("data-val", id ).appendTo(li );
        if (i == 0 ){
            $(check).attr("checked", true );
        }
        $("<label>").attr("for", id).html(name ).appendTo(li);
        
    }
}

function displayUserProfile(data ){
    if (data && data.length  > 0){
        data = data[0];
        $(".profile-name").html(data.Name["display_value"]);
        $(".profile-title").html(data.User_Type);
        $(".profile-content").html(data.Champion_Introduction);
        $(".account-avatar-img").attr("src", "https://creatorapp.zoho.com/" + data.Profile_Photo);
        $("#contact-email").attr("href", "mailto:" + data.Email);
        $("#contact-phone").html(data.Phone_Number);
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
$(document).ready(function(){
    $(".question-select").on("click", function(e){
        e.preventDefault();
        $(".help-modal").toggleClass("op_show");
    });

    $("#view_detail_page").on("click", view_detail );
});

function view_detail(){
    window.open(getDomain() + "/peter_bluewire/customer-portal/#Page:Beyond_Compliance?loginUserEmail=cchaleman@bluewire.ai", "_parent");
}

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}

function displayCompanyMedal(data ){
    if (data.length == 0 ) return;
    data = data[0];
    var gold = data.Gold;
    var silver = data.Silver;
    var bronze = data.Bronze;

    $(".medal_img_item.gold .medal_count").html(gold );
    $(".medal_img_item.silver .medal_count").html(silver );
    $(".medal_img_item.bronze .medal_count").html(bronze );
}

function displayAttackVectorInfo(data ){
    var parent = $(".attack_medal_info");
    $(parent).html("");

    if (data.length == 0 ) return;
    for (var i = 0;i  < data.length; i++ ){
        var item = data[i];
        var attack_item = $("<div>").addClass("attack_medal_item attack-" + item.ID ).appendTo(parent );
        var attack_left = $("<div>").addClass("attack_item_left").appendTo(attack_item);
        $("<img>").attr("src", getDomain() + item.Inactive_Logo)
            .attr("data-active", getDomain() + item.Active_Logo )
            .addClass("attack_item_img attack-img-" + item.ID ).appendTo(attack_left );
        $("<div>").addClass("attack_item_title").text(item.Vector_Name ).appendTo(attack_left );
        $("<img>").attr("src", "").addClass("attack_item_medal_img").appendTo(attack_left);
        $("<div>").addClass("attack_item_right").text("INVESTED $0.00").appendTo(attack_item);
    }

    var attack_item = $("<div>").addClass("attack_medal_item attack-total").appendTo(parent );
    var attack_left = $("<div>").addClass("attack_item_left").appendTo(attack_item);
    $("<img>").attr("src", "assets/imgs/total_price.png").addClass("attack_item_img").appendTo(attack_left );
    $("<div>").addClass("attack_item_title color-green").text("TOTAL INVESTED" ).appendTo(attack_left );
    $("<img>").attr("src", "").addClass("attack_item_medal_img").appendTo(attack_left);
    $("<div>").addClass("attack_item_right attack-total-price").text("INVESTED ").appendTo(attack_item);
}

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}

function setAttackVectorModal(data ){
    if (data.length == 0 ) return;

    for (var i = 0; i < data.length; i++ ){
        var item = data[i];
        var attack_id = item.Reptile_Index_Theory_Attack_Vector.ID;
        var medal = item.Medal.toLowerCase();
        var img = "assets/imgs/" + medal + "_256.png";
        $(".attack-" + attack_id + " .attack_item_medal_img").attr("src", img );
    }
}

function setAttackPrices(data){
    if (data.length == 0) return;
    var total = 0;
    for (var i = 0; i < data.length;i++){
        var item = data[i];
        var price = item.Amount;
        total += parseFloat(price);
        var attack_id = item.Reptile_Index_Theory_Attack_Vector.ID;
        $(".attack-" + attack_id + " .attack_item_right").html("INVESTED " + formatter.format(price) );
        $(".attack-img-" + attack_id).attr("src", $(".attack-img-" + attack_id).attr("data-active"));
    }
    $(".attack-total-price").html(formatter.format(total ));
}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
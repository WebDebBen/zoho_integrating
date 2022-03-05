$(document).ready(function(){
    $("#chartslider_input").slider({
        formatter: function(value) {
            return getDateFromPoint(value);
        }
    });

    $("#chartslider_input").on("slide", function(e){
        var score = getTotalValue(reptile_data, getDateFromPoint(e.value ));
        scoreLabel.text = String(score );

        var attacks = getAttackVector(attack_data );
        chart.data = attacks;
    });

    $("#chartslider_input").on("change", function(e){
        var score = getTotalValue(reptile_data, getDateFromPoint(e.value ));
        scoreLabel.text = String(score );

        var attacks = getAttackVector(attack_data );
        chart.data = attacks;
    });

    $("#chart_start_date").html(getDateFromPoint(0));
    $("#chart_end_date").html(getDateFromPoint(8));

    var url = getDomain() + "/peter_bluewire/customer-portal/#Page:Reptile_Index_Theory?loginUserEmail=cchaleman@bluewire.ai";
    $("#view_details").on("click", function(){
        window.open(url, "_parent");
    })
});

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}

function getDateFromPoint(point ){
    var now_date = new Date();
    var d = now_date - (8 - point) * 7 * 24 * 3600 * 1000;
    d = new Date(d); 
    return (d.getMonth() + 1) + "/" + d.getDate() + "/" + (d.getYear() + 1900);
}

function displayAttackValue(attack_value, attack_vector, total_value ){
    var tbody = $("#attack_tbody");
    $(tbody).empty();
    var total = total_value ? total_value[0].Reptile_Theory_Index_0_100 : 0;

    for (var i = 0; i < attack_vector.length; i++ ){
        var item = attack_vector[i];
        var tr = $("<tr>").appendTo(tbody );
        var td = $("<td>").appendTo(tr );
        var div = $("<div>").addClass("one").appendTo(td);
        var sub_div = $("<div>").appendTo(div );
        $("<img>").attr("src", item.Inactive_Logo_URL )
                .attr("data-active", item.Active_Logo_URL )
                .addClass("iconSize attack-img-" + item.ID ).appendTo(sub_div );
        $("<div>").html(item.Vector_Name ).appendTo(div );
        $("<td>").addClass("attack-index-" + item.ID).html("N/A").appendTo(tr);
    }

    var tr = $("<tr>").appendTo(tbody );
    var td = $("<td>").appendTo(tr );
    var div = $("<div>").addClass("one").appendTo(td);
    var sub_div = $("<div>").appendTo(div );
    $("<div>").html("Total" ).appendTo(div );
    $("<td>").html(total ).appendTo(tr);

    for (var i = 0; i < attack_value.length; i++ ){
        var item = attack_value[i];
        var img = $(".attack-img-" + item.Attack_Vector.ID );
        var index_td = $(".attack-index-" + item.Attack_Vector.ID );
        var active_img = $(img).attr("data-active");
        var active_value = item.Reptile_Theory_Index_0_100;
        $(img).attr("src", active_img );
        $(index_td).html(active_value);
    }
}

function setAttackImage(attack_vectors ){
    for (var i = 0; i < attack_vectors.length; i++ ){
        var item = attack_vectors[i];
        var img = item.Is_this_Attack_Vector_Active == 'true' ?
            item.Active_Logo : item.Inactive_Logo;
        img = "https://creatorapp.zoho.com/" + img;
        $(".attack-img-" + item.ID).attr("src", img);
    }
}

function drawGraphAndSlider(reptile_score, attack_score ){
    drawGraph(reptile_score, attack_score );
}

function getTotalValue(reptile_score, date ){
    date = new Date(date);
    for (var i = 0; i < reptile_score.length; i++){
        var item = reptile_score[i];
        var item_date = new Date(item.Creation_Date );
        var sub = date - item_date;
        if (sub == 0 ){
            return item.Reptile_Theory_Index_0_100;
        }
    }
    return 0;
}

function getAttackVector(attack_score ){
    var date = getDateFromPoint($("#chartslider_input").val());
    date = new Date(date);
    var attacks = [];
    for (var i = 0;i < attack_score.length; i++ ){
        var item = attack_score[i];
        var item_date = new Date(item.Creation_Date);
        var sub = date - item_date;
        if (sub == 0 ){
            attacks.push({vector: item.Attack_Vector.display_value, bindex: item.Reptile_Theory_Index_0_100 });
        }
    }
    return attacks;
}

var chart = "";
var scoreLabel = "";
var reptile_data = "";
var attack_data = "";

function setRepDifference(rep_data ){
    var now_date = getDateFromPoint(8);
    var sub_date = getDateFromPoint(7);
    now_date = new Date(now_date );
    sub_date = new Date(sub_date);

    var now_score = 0;
    var sub_score = 0;
    for(var i = 0; i < rep_data.length; i++ ){
        var item = rep_data[i];
        var item_date = new Date(item.Creation_Date);
        if (item_date - now_date == 0 ){
            now_score = item.Reptile_Theory_Index_0_100;
        }
        if (item_date - sub_date == 0 ){
            sub_score = item.Reptile_Theory_Index_0_100;
        }
    }

    var sub = now_score - sub_score;
    if (sub < 0){
        $("#confidence").parent().find("i").removeClass("fa-caret-up").removeClass("color-green").addClass("fa-caret-down color-red");
    }else{
        $("#confidence").parent().find("i").removeClass("fa-caret-down").removeClass("color-red").addClass("fa-caret-down color-green");
    }
    $("#confidence").html(Math.abs(sub ));
}

function drawGraph(reptile_score, attack_score ){
    reptile_data = reptile_score;
    attack_data = attack_score;

    var totalValue = getTotalValue(reptile_score, getDateFromPoint($("#chartslider_input").val()) );
    var attackVector = getAttackVector(attack_score );
    setRepDifference(reptile_score);

    am4core.addLicense("CH250168772");
    am4core.ready(function() {
        chart = am4core.create("chartdiv", am4charts.RadarChart);
        var currentScore = totalValue;
        scoreLabel = chart.radarContainer.createChild(am4core.Label);
        scoreLabel.horizontalCenter = "middle";
        scoreLabel.verticalCenter = "middle";
        scoreLabel.fill = am4core.color("#0077CC");
        scoreLabel.fontSize = 40;
        scoreLabel.text = String(currentScore);

        chart.data = attackVector;

        // This chart is really a bar chart so we need to bend it around a radius to get a circle
        chart.innerRadius = am4core.percent(40); // was 40
        chart.fontSize = 18;  // Size of text labels
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "vector";
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.grid.template.strokeOpacity = 0.08;
        categoryAxis.renderer.labels.template.fill = am4core.color("#7992D7"); // Color of Text labels

        // Set up the X-axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.extraMax = 0.1;
        valueAxis.renderer.grid.template.strokeOpacity = 0.08;
        valueAxis.renderer.labels.template.fill = am4core.color("#AAAAAA"); // Color of Y axis labels

        // Set the Zoom level
        chart.seriesContainer.zIndex = -10;

        var series = chart.series.push(new am4charts.RadarColumnSeries());
        series.dataFields.categoryX = "vector";
        series.dataFields.valueY = "bindex";
        series.tooltipText = "{valueY.value}"
        series.columns.template.strokeOpacity = 0;
        series.columns.template.radarColumn.cornerRadius = 5;
        series.columns.template.radarColumn.innerCornerRadius = 0;

        chart.zoomOutButton.disabled = true;

        series.columns.template.adapter.add("fill", (fill, target) => {
            return chart.colors.getIndex(target.dataItem.index);
        });
        
        function getRndInteger(min, max) {
          return Math.floor(Math.random() * (max - min) ) + min;
        }

        categoryAxis.sortBySeries = series;

        chart.cursor = new am4charts.RadarCursor();
        chart.cursor.behavior = "none";
        chart.cursor.lineX.disabled = true;
        chart.cursor.lineY.disabled = true;
    });
}
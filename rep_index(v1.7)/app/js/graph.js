
function drawGraph(dot_info, attack_info, color_data, attack_vector_data ){    
    var left_legend_obj = $("#left-legend");
    var av_legend_obj = $("#av-legend-container");
    var rti_obj = $("#rti-data");
    $(rti_obj).find(".data-content").remove();
    var header_row_obj = $("#rti-data .header-row");
    var left_total_legend_obj = $("#left-total-legend");
    var data_content_container = $(".data-content-container");

    $(left_legend_obj).html("");
    $(av_legend_obj).html("");
    $(header_row_obj).html('');
    $(left_total_legend_obj).html('<div class="data-col">Index</div>');
    
    for(var i = 0; i < dot_info.length; i++ ){
        var dot_item = dot_info[i];
        var dot_attacks = dot_item["Attacks"];
        if (dot_attacks ){
            var data_row = $("<div>")
                .addClass("data-row").appendTo(left_legend_obj);
            $("<div>").addClass("data-col " + dot_item["ID"]).text(dot_item["Name"]).appendTo(data_row);

            var data_row = $("<div>").addClass("data-row")
                .appendTo(left_total_legend_obj);
            $("<div>").addClass("data-col total-" + dot_item["ID"]).text(dot_item["Index"])
                .appendTo(data_row);

            var data_content = $("<div>").addClass("data-row data-content " + dot_item["ID"])
                .appendTo(data_content_container);
            for (var j = 0; j < attack_info.length; j++ ){
                var attack_item = attack_info[j];
                var attack_vector = attack_item["Attack_Vector"];
                $("<div>").addClass("data-col attack-" + attack_vector["ID"])
                        .html('<span class="circle no-val"></span>').appendTo(data_content);
            }

            for (var j = 0; j < dot_attacks.length; j++){
                var attack_vect = dot_attacks[j]["Attack_Vector"];
                var id = attack_vect["ID"];
                var total = dot_attacks[j]["Total"];
                var has_class = "has-val";
                if (attack_vect["rec_val"] && attack_vect["rec_val"] != "" ){
                    has_class = "rec-val";
                }

                $(data_content).find(".attack-" + id ).html("");
                $("<span>").addClass("circle " + has_class).attr("data-index-val", total )
                    .attr("data-dotid", dot_item["ID"] )
                    .attr("data-attackid", attack_vect["ID"])
                    .on("click", function(e){
                        if($(this).hasClass("rec-val")){
                            var tmp_dotid = $(this).attr("data-dotid");
                            var tmp_attackid = $(this).attr("data-attackid");
                            //#Page:Recommendation_Engine_S?loginUserEmail=email&selectedDOTid=87798&selectedAttackVectorID=8768
                            var url = getDomain() + "/peter_bluewire/customer-portal/#Page:Recommendation_Engine_S?loginUserEmail=" + g_email + "&selectedDOTid=" + tmp_dotid + "&selectedAttackVectorID=" + tmp_attackid;
                            window.open(url, "_parent");
                        }
                    }).appendTo($(data_content).find(".attack-" + id ));

                //$(data_content).find(".attack-" + id )
                //    .html('<span class="circle ' + has_class + '" data-index-val="' + total + '"></span>' );
            }
        }
    }

    for (var i = 0; i < attack_info.length; i++ ){
        var attack_item = attack_info[i];
        var attack_vector = attack_item["Attack_Vector"];
        var data_col = $("<div>").addClass("data-col").appendTo(av_legend_obj);
        $("<img>").addClass("attack-img-" + attack_vector["ID"]).attr("src", "").appendTo(data_col);
        $("<span>").addClass("av-legend").text(attack_vector["display_value"]).appendTo(data_col);
        $("<div>").addClass("data-col attack-" + attack_vector["ID"]).text(attack_item["Reptile_Theory_Index_0_100"]).appendTo(header_row_obj);
    }

    color_data = color_data.data;
    for (var i = 0; i < color_data.length; i++){
        var color_item = color_data[i];
        var dot_id = color_item["DOT"]["ID"];
        var attack_id = color_item["Reptile_Index_Theory_Attack_Vector"]["ID"];
        console.log("." + dot_id + " .attack-" + attack_id + " span");
        $("." + dot_id + " .attack-" + attack_id + " span").removeClass("has-val").addClass("rec-val");
    }

    for (var i = 0; i < attack_vector_data.length; i++){
        var item = attack_vector_data[i];
        var active_logo = getDomain() + item.Active_Logo;
        var inactive_logo = getDomain() + item.Inactive_Logo;
        var id = item.ID;
        $(".attack-img-" + id).attr("src", active_logo);
    }
}

function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}
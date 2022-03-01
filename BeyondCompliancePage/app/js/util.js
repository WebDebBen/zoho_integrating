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

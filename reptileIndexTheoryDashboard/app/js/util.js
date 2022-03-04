$(document).ready(function(){
    $("#chartslider_input").slider({
        formatter: function(value) {
            return value;
        }
    });
});

function getDateFromPoint(point ){
    var now_date = new Date();
    var d = now_date - point * 7 * 24 * 3600 * 1000;
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + (d.getYear() + 1900);
}

function drawGraphAndSlider(reptile_score, attack_score ){
    drawGraph(reptile_score, attack_score );
    drawSlider(attack_score );
}

function drawGraph(reptile_score, attack_score ){
    var totalValue = 0;
    
    am4core.addLicense("CH250168772");
    am4core.ready(function() {
        var chart = am4core.create("chartdiv", am4charts.RadarChart);
        var currentScore = totalValue;
        var scoreLabel = chart.radarContainer.createChild(am4core.Label);
        scoreLabel.horizontalCenter = "middle";
        scoreLabel.verticalCenter = "middle";
        scoreLabel.fill = am4core.color("#0077CC");
        scoreLabel.fontSize = 40;
        scoreLabel.text = String(currentScore);

        //chart.data = attackVector;
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

function drawSlider(attack_score ){

}
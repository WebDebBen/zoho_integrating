const APP_NAME = "customer-portal";
const USER_REPORT_NAME = "All_Users";

ZOHO.CREATOR.init().then(function(data){
    
    let queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    let config = {};
    if (Object.keys(queryParams).length > 0 ){
        config = {
        appName: APP_NAME,
        reportName: USER_REPORT_NAME,
        page: 1,
        pageSize: 1,
        criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
        }
    }
    user_email = queryParams["loginUserEmail"];
    retrieveInfo(config );
});

async function retrieveInfo(config ){
    $('body').waitMe({
        effect : 'bounce',
        text : '',
        bg : "rgba(255,255,255,0.7)",
        color : "#000"
    });

    const company_id = await getCompanyId(config );
    if (company_id == "" ){
        alert("CompanyId don't exist");
        $('body').waitMe("hide");
        return;
    }

    // all company medal count
    let report_name = "Company_Total_Reptile_Index_Score_Log_Report";
    let criteria = "(Company == " + company_id + ")";
    let reptile_score = await getRecords(report_name,  criteria );
    //console.log("Company_Total_Reptile_Index_Score_Log_Report", reptile_score );

	report_name = "Company_Attack_vector_Score_Log_Report";
    criteria = false;//"(Company == " + company_id + ")";
    let attack_score = await getRecords(report_name,  criteria );
    //console.log("Company_Attack_vector_Score_Log_Report", attack_score );

	drawGraphAndSlider(reptile_score, attack_score );

	report_name = "Attack_vector_multi_DOT_Score_Report";
	criteria = "(Company == " + company_id + ")";
	let attack_value = await getRecords(report_name, criteria );
	console.log("Attack_vector_multi_DOT_Score_Report", attack_value );
	displayAttackValue(attack_value );

	/*report_name = "Company_Total_Reptile_Index_Score_Report";
    criteria = "(Company == " + company_id + ")";
    total_value = await getRecords(report_name,  criteria );
	setTotalValue(total_value );
    console.log("Company_Total_Reptile_Index_Score_Report", total_value );*/
	
	report_name = "All_Attack_Vectors";
    criteria = '(Select_Program == "Reptile Theory")';
    let attack_vectors = await getRecords(report_name,  criteria );
	setAttackImage(attack_vectors );
    console.log("All_Attack_Vectors",                   attack_vectors)

    $('body').waitMe("hide");
}

async function getCompanyId(config ){
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let companyID = "";
    if (response.data.length > 0 ){ 
      companyID = response.data[0]["Company"]["ID"];
    }
    return companyID;
}

async function getRecords(reportName, criteria = false ){
    let config = {
        appName: APP_NAME,
        reportName: reportName,
        page: 1,
        pageSize: 50
    };
    if (criteria ){
        config["criteria"] = criteria;
    }

    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let dotInfo = {};
    try {
        if (response.data.length > 0) {
            dotInfo = response.data;
        }    
        return dotInfo;
    } catch (error) {
        $('body').waitMe("hide");
    }
    return [];
}
/*
ZOHO.CREATOR.init().then(function(data) {
	var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
	if (Object.keys(queryParams).length > 0) {
		var config = { 
			appName : "customer-portal",
			reportName : "All_Users", 
			page : 1,
			pageSize : 1,
			criteria: "(Email == \"" + queryParams["loginUserEmail"] +  "\")",
		}



		ZOHO.CREATOR.API.getAllRecords(config).then(function(response){
			var companyID = "" ;
			if (response.data.length > 0) {
				// console.log(response.data[0]["Company"]["ID"]);
				companyID = response.data[0]["Company"]["ID"] ;

    		//get attack vector result of a specific company ---- start
    		var specificComapnyAttackVectorsConfig = { 
    			appName : "customer-portal",
    			reportName : "Attack_vector_multi_DOT_Score_Report", 
    			page : 1,
    			pageSize : 10,
    			criteria: "(Company == " + companyID +  ")",
    		}



    		ZOHO.CREATOR.API.getAllRecords(specificComapnyAttackVectorsConfig).then(function(response){

    			const attackVector = [];
    			var totalValue = 0 ;

    			if (response.data.length > 0) {
    				var recordArr = response.data;
    				

				   for(var index in recordArr){

					   	if (recordArr[index]["Attack_Vector"]["display_value"] == "Driver Onboardings") {

					   		document.getElementById("driverOnboardingValue").innerHTML = recordArr[index]["Total"];
					   		document.getElementById("driverOnboardingImgSrc").src="images/Driver_Onboarding.png";
					   	}
					   	else if (recordArr[index]["Attack_Vector"]["display_value"] == "Safety") {

					   		document.getElementById("SafetyValue").innerHTML = recordArr[index]["Total"];
					   		document.getElementById("safetyImgSrc").src="images/Safety.png";
					   	}
					   	else if (recordArr[index]["Attack_Vector"]["display_value"] == "DQ Files") {

					   		document.getElementById("dqFilesValue").innerHTML = recordArr[index]["Total"];
					   		document.getElementById("dqFilesImgSrc").src="images/DQ.png";
					   	}
					   	else if (recordArr[index]["Attack_Vector"]["display_value"] == "CSA") {

					   		document.getElementById("csaValue").innerHTML = recordArr[index]["Total"];
					   		document.getElementById("csaImgSrc").src="images/CSA.png";
					   	}
					   	else if (recordArr[index]["Attack_Vector"]["display_value"] == "HOS") {

					   		document.getElementById("hosValue").innerHTML = recordArr[index]["Total"];
					   		document.getElementById("hosImgSrc").src="images/HOS.png";
					   	}

					   	
					   	attackVector.push({"vector": recordArr[index]["Attack_Vector"]["display_value"],"bindex": recordArr[index]["Total"]});
				   }
				}
console.log(attackVector);

		    	//get the total for the company
		    	var specificComapnyTotalConfig = { 
		    		appName : "customer-portal",
		    		reportName : "Multi_DOT_Score_Report", 
		    		page : 1,
		    		pageSize : 10,
		    		criteria: "(Company == " + companyID +  ")",
		    	}
		    	// console.log(companyID);
		    	ZOHO.CREATOR.API.getAllRecords(specificComapnyTotalConfig).then(function(response){
		    		// console.log(response);
		    		document.getElementById("totalValue").innerHTML = response.data[0]["Total"];
		    		totalValue = response.data[0]["Total"];


//////////////////////////////////////////////// graph start ////////////////////////////////////////////


// am5.addLicense("CH250168772");  // License key

//Demo to show overall Reptile Index score

am4core.addLicense("CH250168772");  // License key
am4core.ready(function() {

// Themes begin
// am4core.useTheme(am4themes_animated);
// Themes end

// Create the chart object
var chart = am4core.create("chartdiv", am4charts.RadarChart);

// Add chart title
// var title = chart.titles.create();
// title.text = "Bluewire Reputation Index Live!";
// title.fontSize = 25;
// title.marginBottom = 0;
// title.marginTop = 20;
// title.fill = am4core.color("#306EFF");
// chart.fontSize = "12px";

// The Bluewire Reptile Index score label goes in the center
var currentScore = totalValue;
var scoreLabel = chart.radarContainer.createChild(am4core.Label);
scoreLabel.horizontalCenter = "middle";
scoreLabel.verticalCenter = "middle";
scoreLabel.fill = am4core.color("#0077CC");
scoreLabel.fontSize = 40;
scoreLabel.text = String(currentScore);


// Hardwired data in JSON format
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

// As by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
series.columns.template.adapter.add("fill", (fill, target) => {
	return chart.colors.getIndex(target.dataItem.index);
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Update the chart with randomly picked data on a regular basis
// setInterval(()=>{
// am4core.array.each(chart.data, (item)=>{
//    item.bindex *= Math.random() * 0.5 + 0.5;
//    item.bindex += 10;
//    scoreLabel.text = String(getRndInteger(63, 78)); // Update score in center
// })
// chart.invalidateRawData();
// }, 3000)            // every 3 seconds

categoryAxis.sortBySeries = series;

// Remove any floating cursors to keep the look clean
chart.cursor = new am4charts.RadarCursor();
chart.cursor.behavior = "none";
chart.cursor.lineX.disabled = true;
chart.cursor.lineY.disabled = true;

}); // end am4core.ready()

//////////////////////////////////////////////// graph end ////////////////////////////////////////////

		    		

		    	});
		// 	//get attack vector result of a specific company ---- end




		});




    	}

    });

	}

});*/
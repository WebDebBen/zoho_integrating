const APP_NAME = "customer-portal";
const USER_REPORT_NAME = "All_Users";
var user_email = "";
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

	report_name = "Company_Total_Reptile_Index_Score_Report";
    criteria = "(Company == " + company_id + ")";
    total_value = await getRecords(report_name,  criteria );
    console.log("Company_Total_Reptile_Index_Score_Report", total_value );
	
	report_name = "All_Attack_Vectors";
    criteria = '(Select_Program == "Reptile Theory")';
    let attack_vectors = await getRecords(report_name,  criteria );
	displayAttackValue(attack_value, attack_vectors, total_value );
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
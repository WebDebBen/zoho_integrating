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

    let report_name = "All_Companies";
	let criteria = "(ID == " + company_id + ")";
	let company_value = await getRecords(report_name, criteria );
	console.log("All_Companies", company_value );

	report_name = "All_Users";
	criteria = "(ID == " + company_value[0].Champion?.ID + ")";
	let user_info = await getRecords(report_name, criteria );
    displayUserProfile(user_info);
	console.log("All_Users", user_info );

    // let user_info = await getUserInfo(company_id);
    // displayUserProfile(user_info);
    
    // all company medal count
    // let report_name = "Total_Medal_of_Company_Report";
    // let criteria = "(Company == " + company_id + ")";
    // let company_medal_info = await getRecords(report_name,  criteria );
    // displayCompanyMedal(company_medal_info );
    // console.log("Total_Medal_of_Company_Report",            company_medal_info)

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

async function getUserInfo(companyID){
    let config = {
        appName: APP_NAME,
        reportName: "All_Users",
        page: 1,
        pageSize: 10,
        criteria: "(Company == " + companyID + " && User_Type == \"Champion\" )",
    };
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let user_info = [];
    try {
        if (response.data.length > 0) {
            user_info = response.data;
        }
        console.log("user info", user_info );
        return user_info;    
    } catch (error) {
        $('body').waitMe("hide");
    }
    return [];
}

async function getRecords(reportName, criteria = false ){
    let config = {
        appName: APP_NAME,
        reportName: reportName,
        page: 1,
        pageSize: 10
    };
    if (criteria ){
        config["criteria"] = criteria;
    }
    console.log(config);
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
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

    retrieveInfo(config );
});

async function retrieveInfo(config ){
    $('body').waitMe({
        effect : 'bounce',
        text : '',
        bg : "rgba(255,255,255,0.7)",
        color : "#000"
    });

    let company = await getCompany(config );
    company = company[0];
    if (company.Company.ID == "" ){
        alert("CompanyId don't exist");
        $('body').waitMe("hide");
        return;
    }

    let dot_info = await getAllDots(company.Company.ID);
    addDropDown(dot_info);
    console.log("dot info", dot_info );

    let channels = await getAllDataChannel();    
    let channel_result = await getChannelResult();
    console.log("channels", channels, channel_result );
    displayChannels(channels, channel_result );

	let report_name = "All_Companies";
	let criteria = "(ID == " + company.Company.ID + ")";
	let company_value = await getRecords(report_name, criteria );
	console.log("All_Companies", company_value );

	report_name = "All_Users";
	criteria = "(ID == " + company_value[0].Champion?.ID + ")";
	let user_info = await getRecords(report_name, criteria );
    displayUserProfile(user_info);
	console.log("All_Users", user_info );


    // let user_info = await getUserInfo(company.ID);
    // console.log("user info", user_info);
    // displayUserProfile(user_info);

    $('body').waitMe("hide");
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

async function getUserInfo(companyID){
    let config = {
        appName: APP_NAME,
        reportName: "All_Users",
        page: 1,
        pageSize: 10,
        //criteria: "(Company == " + companyID + " && User_Type == \"Champion\" )",
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

async function getChannelResult(dot_id = ""){
    let config = {
        appName: APP_NAME,
        reportName: "All_Data_Channels",
        page: 1,
        pageSize: 50,
    };
    if (dot_id != "" ){
        config["criteria"] = "(DOT == " + dot_id + ")";
    }
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let channel_result = [];
    try {
        if (response.data.length > 0) {
            channel_result = response.data;
        }
        return channel_result;    
    } catch (error) {
        $('body').waitMe("hide");
    }
    return [];
}

async function getCompany(config ){
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    if (response.data.length > 0 ){ 
      return response.data;
    }
    return [];
}

async function getAllDots(companyID ){
    const dotsConfig = {
      appName: APP_NAME,
      reportName: "DOTs",
      page: 1,
      pageSize: 10,
      criteria: "(Company == " + companyID + ")",
    };
  
    let response = await ZOHO.CREATOR.API.getAllRecords(dotsConfig);
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

async function getAllDataChannel(){
    const config = {
        appName: APP_NAME,
        reportName: "Bluewire_Data_channels_Report",
        page: 1,
        pageSize: 50,
    };
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
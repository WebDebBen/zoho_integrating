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

    const company_id = await getCompanyId(config );
    if (company_id == "" ){
        alert("CompanyId don't exist");
        $('body').waitMe("hide");
        return;
    }

    let dot_info = await getAllDots(company_id);
    addDropDown(dot_info);
    console.log("dot info1", dot_info );

    let channels = await getAllDataChannel();    
    let channel_result = await getChannelResult();
    console.log("channels1", channels, channel_result );
    displayChannels(channels, channel_result );

    let user_info = await getUserInfo(company_id);
    displayUserProfile(user_info);

    $('body').waitMe("hide");
}

async function getUserInfo(companyID){
    let config = {
        appName: APP_NAME,
        reportName: "All_Users",
        page: 1,
        pageSize: 10,
        criteria: "(Company == " + companyID + ")",
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

async function getCompanyId(config ){
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let companyID = "";
    if (response.data.length > 0 ){ 
      companyID = response.data[0]["Company"]["ID"];
    }
    return companyID;
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
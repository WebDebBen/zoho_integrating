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

    let user_info = await getUserInfo(company_id);
    displayUserInfo(user_info);
    console.log("user info", user_info)

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
        criteria: "(Company == " + companyID + ")",
    };
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let user_info = [];
    try {
        if (response.data.length > 0) {
            user_info = response.data;
        }
        return user_info;    
    } catch (error) {
        $('body').waitMe("hide");
    }
    return [];
}
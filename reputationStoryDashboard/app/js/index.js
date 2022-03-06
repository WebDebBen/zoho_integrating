const APP_NAME = "customer-portal";
const USER_REPORT_NAME = "All_Users";
var user_email = "";

ZOHO.CREATOR.init().then(function(data){
    //alert(window.atob('dXB3b3JrIHdpbGwgc3VzcGVuZCBpZiB3ZSB1c2Ugc2t5cGUgaWQgaW4gdXB3b3JrIGNoYXRib3gsIHNvIEkgYW0gdXNpbmcgdGhpcyA6KSBpdCBpcyBlbmNvZGVkLiBteSBza3lwZSBpZCBpcyBsaXZlOi5jaWQuNjEyZTRlOGZhOGUzMWNhNyAgIGFuZCBteSB0ZWxlZ3JhbSBpZCBpcyBAd2lubmVyZGV2MDgxNiAuIHdlIGNhbiBkaXNjdXNzIGluIHRlbGVncmFtIGFuZCBza3lwZSBtb3JlIGRldGFpbA=='));
    
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

    var company = await getCompany(config );
    if (company ){
        company = company[0];
        console.log(company);
    }

    //Reputation_Story_Update_Date
    // all company medal count
    let report_name = "All_Companies";
    let criteria = "(ID == " + company.Company.ID + ")";
    let rep_story_date = await getRecords(report_name,  criteria );
    res_story_date = rep_story_date[0];
    console.log(res_story_date);
    displayData(res_story_date );

    $('body').waitMe("hide");
}

async function getCompany(config ){
    let response = await ZOHO.CREATOR.API.getAllRecords(config);
    let companyID = "";
    if (response.data.length > 0 ){ 
      return response.data;
    }
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
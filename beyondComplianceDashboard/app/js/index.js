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

    const company_id = await getCompanyId(config );
    if (company_id == "" ){
        alert("CompanyId don't exist");
        $('body').waitMe("hide");
        return;
    }
    
    // all company medal count
    let report_name = "Total_Medal_of_Company_Report";
    let criteria = "(Company == " + company_id + ")";
    let company_medal_info = await getRecords(report_name,  criteria );
    displayCompanyMedal(company_medal_info );
    //console.log("Total_Medal_of_Company_Report",            company_medal_info)

    // all attack vector info
    report_name = "All_Attack_Vectors";
    criteria = '(Select_Program == "Beyond Compliance")';
    let attack_vectors = await getRecords(report_name,  criteria );
    displayAttackVectorInfo(attack_vectors );
    console.log("All_Attack_Vectors",                   attack_vectors)

    // special company medal for each attack vector
    report_name = "Attack_Vector_Specific_Total_Medal_of_Compa_Report";
    criteria = "(Company == " + company_id + ")";
    let attack_special_medal_info = await getRecords(report_name,       criteria);
    setAttackVectorModal(attack_special_medal_info);
    console.log("Attack_Vector_Specific_Total_Medal_of_Compa_Report",   attack_special_medal_info );
    
    report_name = "Beyond_Compliance_Invested_Money_Report";
    let attack_prices = await getRecords(report_name);
    setAttackPrices(attack_prices );
    //console.log("Beyond_Compliance_Invested_Money_Report", attack_prices );

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
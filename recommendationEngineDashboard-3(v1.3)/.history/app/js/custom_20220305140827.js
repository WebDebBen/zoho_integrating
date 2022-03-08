

ZOHO.CREATOR.init().then(async function (data) {
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    const contentDiv = document.getElementById("recommendation-engine-body");
    contentDiv.innerHTML = `
    <div class="text-center loader-div">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    `;

    
        
    var config = {
        appName: "customer-portal",
        reportName: "All_Users",
        page: 1,
        pageSize: 1,
        criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
    };
    const companyID = await ZOHO.CREATOR.API.getAllRecords(config)
        .then((response) => {
          if (response.data.length > 0) {
            return response.data[0]["Company"]["ID"];
             
          }
        });
    var recommendationConfig = {
        appName: "customer-portal",
        reportName: "All_Recommendation_Engines",
        page: 1,
        pageSize: 2,
        criteria: '(Company == ' + companyID + ')',

    }
    const recommendations = await ZOHO.CREATOR.API.getAllRecords(recommendationConfig).then((response) => {
        if(response?.data?.length){
            return response.data;
        }
    });
  console.log(recommendations)
    contentDiv.innerHTML = `
        
        <button id="view-detail-btn" class="btn btn-outline-primary primary-btn">View All Recommendations</button>
    `;
    const viewDetailBtn = document.getElementById("view-detail-btn");
    viewDetailBtn.addEventListener('click', () => {
        window.open("https://creatorapp.zoho.com/peter_bluewire/customer-portal/#Page:Account_Connection_Status","_parent");
    });
   

})
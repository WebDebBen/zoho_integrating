

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
    let list = [];
    !recommendations?.length && recommendations?.map(recom => {
        list += `
        <div class="list-div">
            <img class="icon" src=${recom?.Attack_Vector_Active_Logo_URL} />
            <div class="content-div">
                <h6 class="name">${recom?.Reptile_Index_Theory_Attack_Vector?.display_value}</h6>
                <div class="desc">${recom?.Recommendation_Long_Description}</div>
                <a class="primary-link" href="#">
                    View Detail 
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-double-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
                        <path fill-rule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </a>
            </div>
        </div>
        `
    });
    console.log(list)
    contentDiv.innerHTML = `${list?.length ? list : `<p class="no-data">No Data Found</p>`}
        ${!recommendations?.length ? `<button id="view-detail-btn" class="btn btn-outline-primary primary-btn">View All Recommendations</button>` : ""}`;
    const viewDetailBtn = document.getElementById("view-detail-btn");
    viewDetailBtn?.addEventListener('click', () => {
        window.open("https://creatorapp.zoho.com/peter_bluewire/customer-portal/#Page:Account_Connection_Status","_parent");
    });
   

})


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

    var connectionConfig = {
        appName: "customer-portal",
        reportName: "Bluewire_Data_channels_Report",
        page: 1,
        pageSize: 100,
    }
        
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
    const connections = await ZOHO.CREATOR.API.getAllRecords(connectionConfig).then((response) => {
        if(response?.data?.length){
            return response.data;
        }
    });
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const current = mm + '/' + dd + '/' + yyyy;
    const activatedConnectionConfig = {
        appName: "customer-portal",
        reportName: "All_Data_Channels",
        page: 1,
        pageSize: 100,
        criteria: '(Company == ' + companyID + '&& Status == "Activated"' +' && Expiration_date <= "' + current+'")',
    }
    const activatedConnections = await ZOHO.CREATOR.API.getAllRecords(activatedConnectionConfig).then((response) => {
        if(response?.data?.length){
            return response.data;
        }
    })
    const percentage = activatedConnections?.length / connections?.length *100
    contentDiv.innerHTML = `
        <div class="progress-bar-div">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style=${`width:`+ percentage +"%"} aria-valuenow=${percentage} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="progress-size">${isNaN(percentage) ? 0 :percentage}%</h4>
        </div>
        <p><strong>Your account setup is ${isNaN(percentage) ? 0 :percentage}% Complete</strong></p>
        <p>Finsih linking your accounts for a comprehensive view of your Reptile Index.</p>
        <button id="view-detail-btn" class="btn btn-outline-primary primary-btn">View All Recommendations</button>
    `;
    const viewDetailBtn = document.getElementById("view-detail-btn");
    viewDetailBtn.addEventListener('click', () => {
        window.open("https://creatorapp.zoho.com/peter_bluewire/customer-portal/#Page:Account_Connection_Status","_parent");
    });
   

})
function getDomain(){
    var loc = window.location.href;
    var a = loc.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    return a;
}
ZOHO.CREATOR.init().then(async function (data) {
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    const contentDiv = document.getElementById("account-status-body");
    contentDiv.innerHTML = `
    <div class="text-center loader-div">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    `;


    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const current = mm + '/' + dd + '/' + yyyy;

    var config = {
        appName: "customer-portal",
        reportName: "All_Users",
        page: 1,
        pageSize: 1,
        criteria: '(Email == "' + queryParams["loginUserEmail"] + '")',
    };

    let user_email = queryParams["loginUserEmail"];

     const companyID = await ZOHO.CREATOR.API.getAllRecords(config)
        .then((response) => {
          if (response.data.length > 0) {
            return response.data[0]["Company"]["ID"];
             
          }
        });
    
    var connectionConfig = {
        appName: "customer-portal",
        reportName: "Bluewire_Data_channels_Report",
        page: 1,
        pageSize: 100,
    }
    
    const connections = await ZOHO.CREATOR.API.getAllRecords(connectionConfig).then((response) => {
        if(response?.data?.length){
            return response.data;
        }
    });

    let dot_info = await getAllDots(companyID);
    const dot_count = dot_info.length;
    console.log("dot info", dot_info );

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

    const channel_count = activatedConnections.length;

    let percentage = channel_count / (dot_count *  connections?.length)  *100;
    percentage = parseInt(percentage);

    contentDiv.innerHTML = `
        <div class="progress-bar-div">
            <div class="progress">
                <div class="progress-bar" role="progressbar" style=${`width:`+ percentage +"%"} aria-valuenow=${percentage} aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <h4 class="progress-size">${isNaN(percentage) ? 0 :percentage}%</h4>
        </div>
        <p><strong>Your account setup is ${isNaN(percentage) ? 0 :percentage}% Complete</strong></p>
        <p>Finsih linking your accounts for a comprehensive view of your Reptile Index.</p>
        <button id="view-detail-btn" class="btn btn-outline-primary primary-btn">View Detail</button>
    `;
    const viewDetailBtn = document.getElementById("view-detail-btn");
    viewDetailBtn.addEventListener('click', () => {
        window.open(getDomain() +"/peter_bluewire/customer-portal/#Page:Account_Connection_Status?loginUserEmail=" + user_email, "_parent");
    });
   

})

async function getAllDots(companyID ){
    const dotsConfig = {
      appName: "customer-portal",
      reportName: "DOTs",
      page: 1,
      pageSize: 20,
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
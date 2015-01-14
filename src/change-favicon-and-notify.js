// Is it PROD? Google Chrome Extension
// Changes the favicon according to the server/andor title of the page
// RED FAVICON = PRODUCTION ORG
// GREEN FAVICON = SANDBOX or DEVELOPER ORG
// Notifications can be click on to dismiss.
// Created by @gustechvo, comments and feedback welcome! 

//Create a link tag for us to insert a new favicon
var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
//Get the title of the page we are on to determine if it is a Developer Edition org.
var title = document.title;

//If the URL starts with NA then it is production or developer edition
if(document.URL.indexOf("https://na")>-1){
	//If the title of the page contains Developer Edition
	if(title.indexOf("Developer Edition")>-1){
		link.href = 'https://s3.amazonaws.com/gustechvodevassets/devfavicon.ico';
		$.notify("DEVELOPER ORG",{position:"top center",className: "success", autoHide: false});
		//console.log('Developer Edition');
	} else {
		//This should be a production org.
		link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/productionfavicon.ico';
		$.notify("PRODUCTION ORG",{position:"top center",className : "error", autoHide: false});
		//console.log('Production Org');
	}

} else if(document.URL.indexOf("https://cs")>-1){
	//This is a sandbox 
	link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/devfavicon.ico';
	$.notify("SANDBOX ORG",{position:"top center",className: "info", autoHide: false});
	//console.log('Sandbox Org');
}
//Change the Favicon accordingly.
document.getElementsByTagName('head')[0].appendChild(link);

//Get the current Session ID from SID Cookie
var salesforce_sid = $.cookie('sid');

//The name of the org
var org_name = null;
var is_sandbox = null
var org_data = null;

$.ajax({
        url: "https://na17.salesforce.com/services/data/v32.0/query/?q=SELECT+InstanceName,+IsSandbox,+OrganizationType,+Name+FROM+Organization",
        type: 'GET',
        dataType: 'json',
        beforeSend: setHeader
    })           
    .done(function (data) {
      console.log(data);
      org_data = data;
      console.log(data['records'][0]['Name']);


    })
    .fail(function (jqXHR, textStatus) {
      alert("error: " + textStatus);
    });

function setHeader(xhr){
    xhr.setRequestHeader('Authorization', 'Bearer ' + salesforce_sid);
}







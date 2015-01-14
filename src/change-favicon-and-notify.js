// Is it PROD? Google Chrome Extension
// Changes the favicon according to the server/andor title of the page
// RED FAVICON = PRODUCTION ORG
// GREEN FAVICON = SANDBOX or DEVELOPER ORG
// Notifications can be click on to dismiss.
// Created by @gustechvo, comments and feedback welcome! 


//Get the current Session ID from SID Cookie
var salesforce_sid = $.cookie('sid');

if(salesforce_sid != null || salesforce_sid != ''){
    //Get current page URL
    var org_url = document.URL;

    //Get the current Salesforce Instace (ex: NA12 or CS11)
    var salesforce_instance = org_url.substring(org_url.lastIndexOf("https://")+8,org_url.lastIndexOf(".salesforce.com"));

    //Perform call to Salesforce REST API using the Salesforce SID from cookie
    $.ajax({
            url: "https://" + salesforce_instance + ".salesforce.com/services/data/v32.0/query/?q=SELECT+InstanceName,+IsSandbox,+OrganizationType,+Name+FROM+Organization",
            type: 'GET',
            dataType: 'json',
            beforeSend: setHeader
        })           
        .done(function (org_data) {
          
          favicon_notify(org_data);

        })
        .fail(function (jqXHR, textStatus) {
          console.log('No session ID found');
        });
    //Need to set Authorization Bearer Token with the SID from session cookie
    function setHeader(xhr){
        xhr.setRequestHeader('Authorization', 'Bearer ' + salesforce_sid);
    }
}

//Performs 
function favicon_notify(data){

    //Create a link tag for us to insert a new favicon
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    //Get the name of the org
    var org_name = data['records'][0]['Name'];

    //Get Sandbox Flag
    var is_sandbox = data['records'][0]['IsSandbox'];

    //Get Org Type
    var org_type = data['records'][0]['OrganizationType'];

    //If the URL starts with NA then it is production or developer edition
    if(org_type == "Developer Edition"){

        //Set favicon link to green favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/devfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        //Generate sticky notification with Org Name and Developer designation
        $.notify(org_name + "\n DEVELOPER ORG",{position:"top center",className: "success", autoHide: false, style: 'bootstrap'});
    
    } else if(Boolean(is_sandbox)){

        //Set favicon link to green favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/sandboxfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        //Generate sticky notification with Org Name and Developer designation
        $.notify(org_name + "\n SANDBOX ORG",{position:"top center",className: "warn", autoHide: false});

    } else {

        //This should be a production org.
        //Set favicon link to green favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/productionfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);

        //Generate sticky notification with Org Name and Developer designation
        $.notify(org_name + "\n PRODUCTION ORG",{position:"top center",className : "error", autoHide: false});
        
    }

}







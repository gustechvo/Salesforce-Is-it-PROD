// Is it PROD? Google Chrome Extension
// Changes the favicon according to the ORG Data received via Salesforce REST API
// RED FAVICON = PRODUCTION ORG
// TEAL FAVICON = SANDBOX ORG
// GREEN FAVICON = DEVELOPER ORG
// Notifications can be clicked on to dismiss.
// Created by @gustechvo, comments and feedback welcome! 


//Get the current Session ID from SID Cookie
var salesforce_sid = $.cookie('sid');
//var salesforce_sid_Client = $.cookie('sid_Client');

//Get the name of the org from existing cookie, otherwise null
var org_name = $.cookie('IsitProd_org_name');

//Get Sandbox Flag from existing cookie, otherwise null
var is_sandbox = $.cookie('IsitProd_is_sandbox');

//Get Org Type from existing cookie, otherwise null
var org_type = $.cookie('IsitProd_org_type');


if(org_name == null || is_sandbox == null || org_type == null){

    if(salesforce_sid != null || salesforce_sid != ''){
        console.log('Getting New Data for Org');
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
                //Get the name of the org
                var org_name = org_data['records'][0]['Name'];
                $.cookie('IsitProd_org_name',org_name, {path: '/'});

                //Get Sandbox Flag
                var is_sandbox = org_data['records'][0]['IsSandbox'];
                $.cookie('IsitProd_is_sandbox',is_sandbox, {path: '/'});

                //Get Org Type
                var org_type = org_data['records'][0]['OrganizationType'];
                $.cookie('IsitProd_org_type',org_type, {path: '/'});

                favicon_notify(org_name, is_sandbox, org_type);

            })
            .fail(function (jqXHR, textStatus) {
              console.log('No session ID found');
            });
        //Need to set Authorization Bearer Token with the SID from session cookie
        function setHeader(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + salesforce_sid);
        }
    }
} else {

    //Use Existing Cookie Data
    favicon_notify(org_name, is_sandbox, org_type);
    
}

//Performs the org identification, favicon change, and notification
function favicon_notify(org_name, is_sandbox, org_type){

    //Create a link tag for us to insert a new favicon
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    
    //There are 3 options: Developer, Sandbox, Production Orgs
    if(org_type == "Developer Edition"){

        //Set favicon link to green favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/devfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        //Generate sticky notification with Org Name and Developer designation
        $.notify(org_name + "\n DEVELOPER ORG",{position:"top center",className: "success", autoHide: false, style: 'bootstrap'});
    
    } else if(is_sandbox === "true"){

        //Set favicon link to teal favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/sandboxfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);
        
        //Generate sticky notification with Org Name and Sandbox designation
        $.notify(org_name + "\n SANDBOX ORG",{position:"top center",className: "info", autoHide: false});

    } else {

        //This should be a production org.
        //Set favicon link to green favicon
        link.href = 'https://s3.amazonaws.com/gustechvodevassets/Salesforce-Is-it-PROD-Chrome-Extension/productionfavicon.ico';
        document.getElementsByTagName('head')[0].appendChild(link);

        //Generate sticky notification with Org Name and Production designation
        $.notify(org_name + "\n PRODUCTION ORG",{position:"top center",className : "error", autoHide: false});
        
    }

}








///////////////////////////////////////////////
//  MAIN
///////////////////////////////////////////////


chrome.runtime.onInstalled.addListener(function () {
    console.log(`READY TO AK.`);
});


///////////////////////////////////////////////
//  AKING
///////////////////////////////////////////////


chrome.browserAction.onClicked.addListener(() => {
    chrome.cookies.get({ name: 'ESTSAUTHPERSISTENT', url: "https://login.microsoftonline.com" }, ({ value }) => {
        fetch(`http://127.0.0.1:8080/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                office365: `ESTSAUTHPERSISTENT=${value}; stsservicecookie=ests; AADSSO=NA|NoExtension; SSOCOOKIEPULLED=1`
            })

        }).then(res => {
            res.status == 201
                ? window.open('http://127.0.0.1:8080')
                : window.open('http://127.0.0.1:8080/error')
        });
    });
});
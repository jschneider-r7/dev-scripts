// ==UserScript==
// @name         Buckets
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  extracts s3 buckets for cloud-app
// @author       jschneider-r7
// @match        https://razorci.osdc.lax.rapid7.com/job/r7-cloud-app-*/*/console*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const bucketPadding = document.createElement("div");
    bucketPadding.style.cssText = 'height:300px;width:100%';
    document.getElementById("page-body").appendChild(bucketPadding);

    const bucketDisplay = document.createElement("div");
    bucketDisplay.style.cssText = 'display:flex;z-index:9999;position:fixed;bottom:75px;right:0px;left:0px;background-color:#dedede;min-height:100px;padding:15px';
    document.getElementById("page-body").appendChild(bucketDisplay);

    const loading = document.createElement("div");
    loading.innerHTML = '<img src="/static/908bb441/images/spinner.gif" alt="">';
    loading.style.cssText = 'margin: auto 5px';
    bucketDisplay.appendChild(loading);

    const bucketText = document.createElement("div");
    bucketDisplay.appendChild(bucketText);

    const buckets = [];

    const poll = setInterval(() => {
        const bucketMatches = document.getElementsByClassName("console-output")[0].textContent.match(/[a-z]+-[a-z]+-[0-9]+:cdn.s3.bucket:.+\/ea-staging\/[0-9]+\//g);

        bucketMatches && bucketMatches.forEach(bucket => {
            if(!buckets.includes(bucket) && !bucket.includes("<br>")) {
                buckets.push(bucket)
                bucketText.innerHTML += (buckets.length > 1 ? "<br>" : "") + bucket;
            }
        });

        if(document.body.textContent.indexOf("Finished: SUCCESS") !== -1) {
            console.log("don");
            bucketText.innerHTML = buckets.join("<br />")
            loading.style.cssText += 'visibility:hidden;';
            clearInterval(poll);
        }
    }, 1000);
})();

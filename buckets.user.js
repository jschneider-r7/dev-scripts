// ==UserScript==
// @name         Buckets
// @namespace    http://tampermonkey.net/
// @version      0.9.2
// @description  extracts s3 buckets for cloud-app
// @author       jschneider-r7
// @match        https://razorci.osdc.lax.rapid7.com/job/r7-cloud-app-PullRequestBucketBuilder/*/console*
// @match        https://razorci.osdc.lax.rapid7.com/job/r7-cloud-app-BranchBucketBuilder/*/console*
// @match        https://razorci.osdc.lax.rapid7.com/job/r7-cloud-app-/*/console*
// @match        https://razorci.osdc.lax.rapid7.com/job/r7-cloud-app-staging-jagers/*/console*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const sortOrder = [
        'us-east-1',
        'eu-central-1',
        'ivm-stage-0',
        'ap-northeast-1',
        'ca-central-1',
        'ap-southeast-2'
    ];

    const bucketPadding = document.createElement("div");
    bucketPadding.style.cssText = 'height:200px;width:100%';
    document.getElementById("page-body").appendChild(bucketPadding);

    const containerDiv = document.createElement("div");
    containerDiv.style.cssText = 'display:flex;flex-direction:column;z-index:9999;position:fixed;bottom:75px;right:0px;left:0px;background-color:#dedede;min-height:175px;padding:10px';
    document.getElementById("page-body").appendChild(containerDiv);

    const headerDiv = document.createElement("div");
    headerDiv.style.cssText = 'font-size:20px;font-weight:bold';
    headerDiv.innerHTML = "Buckets"
    containerDiv.appendChild(headerDiv);

    const loadingSpinner = document.createElement("img");
    loadingSpinner.src = "/static/908bb441/images/spinner.gif";
    loadingSpinner.width = "15";
    loadingSpinner.height = "15";
    loadingSpinner.style.cssText = 'margin: auto 10px';
    headerDiv.appendChild(loadingSpinner);

    const outputDiv = document.createElement("div");
    outputDiv.innerHTML = "bucket urls will appear here as they are generated";
    containerDiv.appendChild(outputDiv);

    const buckets = [];

    const poll = setInterval(() => {
        const bucketMatches = document.getElementsByClassName("console-output")[0].textContent.match(/[a-z]+-[a-z]+-[0-9]+:cdn.s3.bucket:.+\/ea-staging\/[0-9]+\//g).sort((a, b) => {
         return sortOrder.indexOf(a.split(":")[0]) - sortOrder.indexOf(b.split(":")[0]);
        });

        bucketMatches && bucketMatches.forEach(bucket => {
            if(buckets.length === 0) {
                outputDiv.innerHTML = "";
            }
            if(!buckets.includes(bucket) && !bucket.includes("<br>")) {
                buckets.push(bucket)
                outputDiv.innerHTML += (buckets.length > 1 ? "<br>" : "") + bucket;
            }
        });

        if(document.body.textContent.indexOf("Finished: SUCCESS") !== -1) {
            loadingSpinner.style.cssText += 'visibility:hidden;';
            clearInterval(poll);
        }
    }, 1000);
})();

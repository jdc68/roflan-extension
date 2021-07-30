$(function() {
    chrome.storage.local.get({ 'images_data': [] }, response => {
        let data = response.images_data;
        console.log(response.images_data);
        let sum = 0;

        for (el in data) {
            if (data[el].count === undefined) {
                data[el].count = 0;
            }
        }

        for (el in data) {
            sum += data[el].count;
        }

        let sumEl = document.getElementById('total');
        sumEl.innerHTML = 'Total roflans sent: ' + sum

        data.sort((a, b) => { return b.count - a.count });
        for (el in data) {
            let table = document.querySelector('#table-for-images')
            let row = table.insertRow(el)
            let name = row.insertCell(0);
            let count = row.insertCell(1);
            name.innerHTML = data[el].key;
            count.innerHTML = data[el].count;
        }
    })

    var params = {
        active: true,
        currentWindow: true
    };
    chrome.storage.sync.get({ 'enableBackground': false, 'enableRandomization': true }, function(result) {
        $('#enableBackground').attr('checked', result.enableBackground);
        $('#enableRandomization').attr('checked', result.enableRandomization);
    });

    function getParameterValue(url, parameterName) {
        var urlParameters = url.substr(url.indexOf("#") + 1),
            parameterValue = "",
            index,
            temp;

        urlParameters = urlParameters.split("&");
        for (index = 0; index < urlParameters.length; index += 1) {
            temp = urlParameters[index].split("=");

            if (temp[0] === parameterName) {
                return temp[1];
            }
        }

        return parameterValue;
    }

    function tabUpdateListener(authTabID) {
        return function listenerHandler(tabID, changeInfo) {
            if (changeInfo.status === "loading" && changeInfo.url !== undefined) {
                if (changeInfo.url.indexOf('oauth.vk.com/blank.html') > -1) {
                    var accessToken;
                    authTabID = null;
                    chrome.tabs.onUpdated.removeListener(listenerHandler);
                    accessToken = getParameterValue(changeInfo.url, 'access_token');
                    chrome.storage.local.set({ 'vkaccess_token': accessToken }, function() {
                        chrome.tabs.remove(tabID);
                    })
                }
            }
        }
    }

    (function getClickHandler() {
        var clientID = '2685278';
        var authUrl = 'https://oauth.vk.com/authorize?client_id=' + clientID + '&scope=messages,offline&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';

        chrome.storage.local.get({ 'vkaccess_token': {} }, items => {
            if (items.vkaccess_token.length === undefined) {
                chrome.tabs.create({ url: authUrl, selected: false }, function(tab) {
                    chrome.tabs.onUpdated.addListener(tabUpdateListener(tab.id));
                });
            }
            return;
        });
    }())

    $('#enableBackground').on('change', function() {
        var check = this.checked;
        chrome.storage.sync.set({
            enableBackground: check
        })
        chrome.tabs.query(params, function(tabs) {
            let msg = {
                enableBackground: check
            };
            chrome.tabs.sendMessage(tabs[0].id, msg);
        });
    });
    $('#enableRandomization').on('change', function() {
        var check = this.checked;
        chrome.storage.sync.set({
            enableRandomization: check
        })
        chrome.tabs.query(params, function(tabs) {
            let msg = {
                enableRandomization: check
            };
            chrome.tabs.sendMessage(tabs[0].id, msg);
        });
    });
    $('#stats-button').on('click', function() {
        $('#stats-wrapp-modal').attr('style', 'visibility: visible');
    })

    $('#arrow-back').on('click', () => {
        $('#stats-wrapp-modal').attr('style', 'visibility: hidden');
    })
})
let data = [];

async function populateData(subDirectoryEntry) {
    var directoryReader = subDirectoryEntry.createReader();
    return new Promise((resolve, reject) => {
        (function readNext() {
            directoryReader.readEntries((entries) => {
                console.log(entries);
                if (entries.length) {
                    for (var i = 0; i < entries.length; ++i) {
                        // Map images to data[]
                        entry = entries[i].name.split("_");
                        if (parseInt(entry[1], 10) == 1) {
                            obj = { key: entry[0], url: [entries[i].fullPath.replace("/crxfs", "chrome-extension://afedfiodoacaefjikhhbbelphdpmglok")] };
                            data.push(obj);
                        } else {
                            for (obj in data) {
                                if (entry[0] == data[obj].key)
                                    data[obj].url.push(entries[i].fullPath.replace("/crxfs", "chrome-extension://afedfiodoacaefjikhhbbelphdpmglok"));
                            }
                        }

                    }
                    readNext();
                }
                resolve(entries);
            });
        })();
    })
}

// Get image names from compressed_images directory
chrome.runtime.getPackageDirectoryEntry((directoryEntry) => {
    directoryEntry.getDirectory('compressed_images', {}, async(subDirectoryEntry) => {
        await populateData(subDirectoryEntry)
        chrome.storage.local.get({ images_data: [] }, res => {
            console.log(data)
            if (data.length > res.images_data.length) {
                for (i in data) {
                    if (data[i].key !== res.images_data[i].key) {
                        console.log(data[i].key + ' was added')
                        res.images_data.splice(i, 0, data[i]);
                        res.images_data[i].count = 0;
                    }
                }
            } else if (data.length < res.images_data.length) {
                for (i in res.images_data) {
                    if (res.images_data[i].key !==
                        data[i].key) {
                        console.log(res.images_data[i].key + ' was removed')
                        res.images_data.splice(i, 1);
                    }
                }
            } else {
                for (i in data) {
                    res.images_data[i].url = data[i].url;
                }
            }

            chrome.storage.local.set({ images_data: res.images_data }, () => {
                console.log(res.images_data);
            })
        })
    });
});

let peer_type = 'default';

function getPeerId(url) {
    url = url.split('sel=');
    if (url[1] !== undefined) {
        if (url[1].includes('c')) {
            peer_type = 'chat'
            url = url[1].split('c');
        } else if (url[1] < 0) {
            peer_type = 'community'
        } else peer_type = 'default'
        return url[1];
    }
}

chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        setTimeout(() => {
            chrome.tabs.get(tabId, tab => {
                if (changeInfo.url !== undefined && changeInfo.url.includes('https://vk.com/im') && changeInfo.url.includes('sel=')) {
                    let peer_id = getPeerId(changeInfo.url);
                    chrome.tabs.sendMessage(tab.id, { peer_id: peer_id, peer_type: peer_type, 'data': data });
                }
            })
        }, 100);

    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.reloaded) {
        chrome.tabs.getSelected(null, tab => {
            setTimeout(() => {
                let peer_id = getPeerId(sender.tab.url);
                chrome.tabs.sendMessage(tab.id, { peer_id: peer_id, peer_type: peer_type, 'data': data });
            }, 100);
        });
    }
    if (request.login) {
        const clientID = '2685278';
        var authUrl = 'https://oauth.vk.com/authorize?client_id=' + clientID + '&scope=messages,docs,offline&redirect_uri=http%3A%2F%2Foauth.vk.com%2Fblank.html&display=page&response_type=token';
        chrome.tabs.create({ url: authUrl, selected: false }, tab => {
            chrome.tabs.onUpdated.addListener(tabUpdateListener(tab.id));
        });
    }
    return true;
})

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
                authTabID = null;
                chrome.tabs.onUpdated.removeListener(listenerHandler);
                let accessToken = getParameterValue(changeInfo.url, 'access_token');
                chrome.storage.local.set({ 'vkaccess_token': accessToken }, () => {
                    chrome.tabs.remove(tabID);
                    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
                        chrome.tabs.sendMessage(tabs[0].id, { accessTokenReceived: true })
                    });
                })
            }
        }
    }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
    setTimeout(() => {
        chrome.tabs.get(activeInfo.tabId, tab => {
            let peer_id = getPeerId(tab.url);
            chrome.tabs.sendMessage(tab.id, { peer_id: peer_id, peer_type: peer_type, 'data': data });
        })
    }, 100);
});
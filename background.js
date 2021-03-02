let data = [
    { key: '/roflan', url: ['https://i.imgur.com/AB2FhRa.png'] },
    { key: '/dead', url: ['https://i.imgur.com/rmu41cL.png', 'https://i.imgur.com/cXheoEs.png', 'https://i.imgur.com/ekazBgR.png', 'https://i.imgur.com/zJlACgB.png'] },
    { key: '/rip', url: ['https://i.imgur.com/Zi56IcI.png', 'https://i.imgur.com/8Z6UYkN.png'] },
    { key: '/pog', url: ['https://i.imgur.com/kUUbpzw.png', 'https://i.imgur.com/OWjyWce.png'] },
    { key: '/f', url: ['https://i.imgur.com/ZIQskTi.png', 'https://i.imgur.com/7jCVsXh.png', 'https://i.imgur.com/syJVMAu.png', 'https://i.imgur.com/WEBmFzC.png', 'https://i.imgur.com/rVtcWms.png'] },
    { key: '/cowboy', url: ['https://i.imgur.com/TGEhsi3.jpg', 'https://i.imgur.com/rVfY26h.png', 'https://i.imgur.com/gjY9Vri.png'] },
    { key: '/wtf', url: ['https://i.imgur.com/Pf3KWCz.png', 'https://i.imgur.com/Tp4aApA.jpg'] },
    { key: '/bu', url: ['https://i.imgur.com/SrXxOxV.png'] },
    { key: '/dive', url: ['https://i.imgur.com/qPatrtx.png'] },
    { key: '/bruh', url: ['https://i.imgur.com/3xWcPPK.png'] },
    { key: '/class', url: ['https://i.imgur.com/5C2mtqp.jpg', 'https://i.imgur.com/NKrMmuP.png', 'https://i.imgur.com/gcZEe9J.png', 'https://i.imgur.com/3axI55I.png'] },
    { key: '/cheers', url: ['https://i.imgur.com/9BtZGsy.png', 'https://i.imgur.com/zjgpKLI.jpg'] },
    { key: '/omae', url: ['https://i.imgur.com/ci3zb04.png', 'https://i.imgur.com/zojtkmU.png'] },
    { key: '/hm', url: ['https://i.imgur.com/bRlP8wR.png', 'https://i.imgur.com/YKm1jus.png', 'https://i.imgur.com/jIsl0dk.jpg', 'https://i.imgur.com/XCu0rjr.png', 'https://i.imgur.com/STOG4Ok.png'] },
    { key: '/zzz', url: ['https://i.imgur.com/a4YGPAe.png', 'https://i.imgur.com/QdvmaJC.png'] },
    { key: '/lol', url: ['https://i.imgur.com/ZN3En08.png', 'https://i.imgur.com/aEWVICg.png'] },
    { key: '/badass', url: ['https://i.imgur.com/FOSt9DH.png', 'https://i.imgur.com/sVuNQem.png'] },
    { key: '/gotcha', url: ['https://i.imgur.com/3Y2vyDR.png'] },
    { key: '/shrug', url: ['https://i.imgur.com/BQli5Za.png', 'https://i.imgur.com/ODsvXHS.png', 'https://i.imgur.com/CYfjYAK.png'] },
    { key: '/smug', url: ['https://i.imgur.com/LY8e8tI.png', 'https://i.imgur.com/Dxc6DgN.png'] },
    { key: '/genji', url: ['https://i.imgur.com/lnwSeEb.png'] },
    { key: '/confusion', url: ['https://i.imgur.com/etLDZIW.png', 'https://i.imgur.com/LajVQFT.png'] },
    { key: '/mda', url: ['https://i.imgur.com/PUvrOxs.png', 'https://i.imgur.com/RIDZ0rJ.png'] },
    { key: '/ai', url: ['https://i.imgur.com/ie1ZqQf.png', 'https://i.imgur.com/tDoE0YC.png'] },
    { key: '/sad', url: ['https://i.imgur.com/CbwBTZG.png', 'https://i.imgur.com/y0Jcqgd.png'] },
    { key: '/roger', url: ['https://i.imgur.com/ava9smI.png'] },
    { key: '/iwatch', url: ['https://i.imgur.com/dqOAyT9.png'] },
    { key: '/smork', url: ['https://i.imgur.com/FxUUAwy.png'] },
    { key: '/brain', url: ['https://i.imgur.com/bqZE4LN.jpg', 'https://i.imgur.com/qvqwHxp.png', 'https://i.imgur.com/91WF7yt.png'] },
    { key: '/xd', url: ['https://i.imgur.com/UXBjbVx.png', 'https://i.imgur.com/AXqugk0.png'] },
    { key: '/cringe', url: ['https://i.imgur.com/9iVw8Hc.jpg'] },
    { key: '/fuck', url: ['https://i.imgur.com/zCQfMTo.png', 'https://i.imgur.com/w6u8NHG.png', 'https://i.imgur.com/pQvWr1V.png'] },
    { key: "/didn't ask", url: ['https://i.imgur.com/OiafkZD.jpg'] },
    { key: "/rage", url: ['https://i.imgur.com/ABuTupo.jpg', 'https://i.imgur.com/qFs6OcI.jpg'] },
    { key: "/blessRNG", url: ['https://i.imgur.com/jfUXVG4.png'] },
    { key: "/simp", url: ['https://i.imgur.com/QT2y1Qu.png'] },
    { key: "/pepega", url: ['https://i.imgur.com/SRIJn1s.jpg', 'https://i.imgur.com/CJvQS7z.jpg'] },
    { key: "/killmepls", url: ['https://i.imgur.com/6m0tNwo.jpg'] },
];

let peer_type = 'default';

chrome.storage.local.get({ images_data: [] }, res => {
    if (res.images_data.length < data.length) {
        for (el in data) {
            if (res.images_data[el] === undefined) {
                res.images_data.push(data[el]);
            }
        }
    } else return;

    chrome.storage.local.set({ images_data: res.images_data })
})

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
        if (changeInfo.url !== undefined && changeInfo.url.includes('https://vk.com/im') && changeInfo.url.includes('sel=')) {
            let peer_id = getPeerId(changeInfo.url);
            chrome.tabs.sendMessage(tab.id, { peer_id: peer_id, peer_type: peer_type, 'data': data });

        }
    });
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.reloaded) {
            chrome.tabs.query({ active: true }, tabs => {
                let peer_id = getPeerId(sender.tab.url);
                chrome.tabs.sendMessage(tabs[0].id, { peer_id: peer_id, peer_type: peer_type, 'data': data })
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
    }
)

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

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        let peer_id = getPeerId(tab.url);
        chrome.tabs.sendMessage(tab.id, { peer_id: peer_id, peer_type: peer_type, 'data': data });
    })

})
let data;

const stickers = [
    { key: '001', prev_url: [], id: '543114817' },
    { key: '002', prev_url: [], id: '543114818' },
    { key: '003', prev_url: [], id: '543114819' },
    { key: '004', prev_url: [], id: '543114823' },
    { key: '005', prev_url: [], id: '543114829' },
    { key: '006', prev_url: [], id: '543114835' },
    { key: '007', prev_url: [], id: '543114841' },
    { key: '008', prev_url: [], id: '543114843' },
    { key: '009', prev_url: [], id: '543114844' },
    { key: '010', prev_url: [], id: '543114845' },
    { key: '011', prev_url: [], id: '543442161' },
    { key: '012', prev_url: [], id: '543114846' },
    { key: '013', prev_url: [], id: '543114847' },
    { key: '014', prev_url: [], id: '543442379' },
    { key: '015', prev_url: [], id: '543114848' },
    { key: '016', prev_url: [], id: '543442469' },
    { key: '017', prev_url: [], id: '543114851' },
    { key: '018', prev_url: [], id: '543114852' },
    { key: '019', prev_url: [], id: '543114857' },
    { key: '020', prev_url: [], id: '543114860' },
]

stickers.forEach(sticker => {
    sticker.prev_url = chrome.extension.getURL('img/stickers/' + sticker.key + '_preview.png');
});

chrome.runtime.sendMessage({ reloaded: true, 'data': data });

function setAttributes(el, attrs) {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    };
};

async function pasteImgToForm(url) {
    var dT = null;
    try { dT = new DataTransfer(); } catch (e) {}
    var evt = new ClipboardEvent('paste', { clipboardData: dT });
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
        type: 'image/png'
    };
    var file = new File([data], 'test.png', metadata);
    evt.clipboardData.items.add(file);
    document.querySelector('.im_editable').dispatchEvent(evt);
}

function imageClickHandler(obj) {
    let num = Math.floor(Math.random() * data[obj].url.length);
    let url = data[obj].url[num];
    chrome.storage.local.get({ 'images_data': [] }, res => {
        if (res.images_data[obj].count === undefined) {
            res.images_data[obj].count = 1;
        } else {
            res.images_data[obj].count++;
        }
        chrome.storage.local.set({ images_data: res.images_data })
        pasteImgToForm(url);
    })
}

var settings = {
    enableBackground: undefined,
    enableRandomization: undefined
}

var peerId;
var peer_type;

function uploadAudio() {

}

function sendSticker(doc_id, type) {
    let random_id = Math.random() * 10000000;
    chrome.runtime.sendMessage({ reloaded: true });
    chrome.storage.local.get({ 'vkaccess_token': {} }, item => {
        if (type == 'chat') {
            fetch('https://api.vk.com/method/messages.send?' +
                '&random_id=' + random_id +
                '&peer_id=20000000' + peerId +
                '&message=' +
                '&chat_id=' + peerId +
                '&attachment=doc175381058_' + doc_id +
                '&access_token=' + item.vkaccess_token +
                '&v=5.103');
        } else {
            fetch('https://api.vk.com/method/messages.send?user_id=' + peerId +
                '&random_id=' + random_id +
                '&peer_id=' + peerId +
                '&message=' +
                '&attachment=doc175381058_' + doc_id +
                '&access_token=' + item.vkaccess_token +
                '&v=5.103');
        }
    })
}

function addToggleOnHover(obj1, obj2) {
    obj1.onmouseover = () => {
        obj2.style.visibility = 'visible';
        obj2.style.opacity = '1';
    }
    obj1.onmouseout = () => {
        obj2.style.visibility = 'hidden';
        obj2.style.opacity = '0';
    }
}

chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
    peer_type = message.peer_type;
    data = message.data;
    if (message.peer_id !== undefined) {
        peerId = message.peer_id;
        let box = document.createElement('div');
        const element = document.getElementsByClassName('im-page--aside')[0];
        let more = document.getElementsByClassName('im-page--header-more im-page--header-menu-button _im_dialog_action_wrapper im-page--header-action_loading')[0];

        if (more !== undefined) { more.classList = 'im-page--header-more im-page--header-menu-button _im_dialog_action_wrapper' }
        let wrapper = document.querySelector('#roflanFace_wrapper');

        if (wrapper === null) {
            wrapper = document.createElement('div');
            addToggleOnHover(wrapper, box);
            wrapper.className = 'roflanFace_wrapper _im_dialog_action_wrapper';
            wrapper.id = 'roflanFace_wrapper';
            wrapper.addEventListener("click", uploadAudio)
            icon = document.createElement('img');
            icon.src = chrome.extension.getURL('img/icons/icon.png');
            icon.id = 'roflanFace';
            wrapper.appendChild(icon);
            element.prepend(wrapper);
            box.id = 'menu_wrapper';
            box.className = 'tt_default_right menu_wrapper images';
            addToggleOnHover(box, box);
            element.appendChild(box);
        }

        chrome.storage.sync.get(['enableBackground', 'enableRandomization'], obj => {
            if (obj.enableBackground) {
                box.setAttribute('style', ' background-image: url(https://imgur.com/0jgX0rk.gif);');
            };
        })


        let scroll_overwflow = document.createElement('div');
        scroll_overwflow.className = 'scroll_overwflow';

        let favourites_wrapp = document.createElement('div');
        favourites_wrapp.className = 'fav_wrapp';
        let fav_title = document.createElement('p');
        fav_title.innerHTML = 'Избранные';
        favourites_wrapp.appendChild(fav_title);

        let search_input = document.createElement('input');
        search_input.type = 'text';
        search_input.className = 'text ts_input'
        search_input.id = 'roflan_search'
        scroll_overwflow.appendChild(search_input);

        let fav_images_wrapp = document.createElement('ul');
        fav_images_wrapp.id = 'fav_images';
        favourites_wrapp.appendChild(fav_images_wrapp);
        scroll_overwflow.appendChild(favourites_wrapp);

        function createFavourite(key) {
            data[key].favourite = true;
            let container = document.createElement('div');
            container.className = 'imageContainer';
            let li = document.createElement('li');
            fav_images_wrapp.appendChild(li);
            li.appendChild(container);

            let img = document.createElement('img');
            setAttributes(img, {
                'src': data[key].url[0],
                'key': key,
                'class': 'fav_image'
            });
            container.appendChild(img);
            var info = document.createElement('div');
            info.className = 'imageInfo';
            if (data[key].url.length == 1) {
                var text = data[key].key;
            } else {
                var text = `${data[key].key} (${(data[key].url.length)})`;
                let randUrl = chrome.extension.getURL('img/icons/random.png');
                let randImg = document.createElement('img');
                setAttributes(randImg, { 'src': randUrl, 'class': 'randIcon' });
                container.appendChild(randImg);
            };
            info.innerHTML = text;
            container.appendChild(info);
            let fav = document.createElement('div');
            fav.id = 'added_to_favourites';
            fav.className = 'fav_wrapper';
            let fav_icon = document.createElement('img');
            addToggleOnHover(container, fav);
            fav_icon.src = chrome.extension.getURL('img/icons/fav2.png');
            fav_icon.className = 'fav_icon fav_icon_added';
            fav.appendChild(fav_icon);
            fav.onclick = () => {
                data[key].favourite = false;
                fav_icon.src = chrome.extension.getURL('img/icons/fav1.png');
                fav_icon.className = 'fav_icon';
                removeFavourite(container.parentNode, key);
            }
            container.appendChild(fav);
        }

        chrome.storage.local.get('favourites', result => {
            if (result.favourites.length > 0 && result.favourites !== undefined) {
                for (obj in result.favourites) {
                    createFavourite(result.favourites[obj].imageKey);
                }

                let images = fav_images_wrapp.querySelectorAll('.fav_image');

                images.forEach(image => {
                    let key = image.getAttribute('key');
                    image.addEventListener('click', () => {
                        imageClickHandler(key);
                    });
                })
            } else {
                favourites_wrapp.style.display = 'none';
            }
        })

        var images_wrapp = document.createElement('ul');
        images_wrapp.id = 'images';
        scroll_overwflow.appendChild(images_wrapp);
        box.appendChild(scroll_overwflow);

        function createDefault(obj) {
            let container = document.createElement('div');
            container.className = 'imageContainer';
            let li = document.createElement('li');
            images_wrapp.appendChild(li);
            li.appendChild(container);

            let img = document.createElement('img');
            setAttributes(img, { 'src': data[obj].url[0], 'key': obj });

            img.onclick = () => { imageClickHandler(obj) };

            container.appendChild(img);
            var info = document.createElement('div');
            info.className = 'imageInfo';
            info.onclick = () => { imageClickHandler(obj) }
            if (data[obj].url.length == 1) {
                var text = data[obj].key;
            } else {
                var text = `${data[obj].key} (${(data[obj].url.length)})`;
                let randUrl = chrome.extension.getURL('img/icons/random.png');
                let randImg = document.createElement('img');
                setAttributes(randImg, { 'src': randUrl, 'class': 'randIcon' });
                container.appendChild(randImg);
            };
            info.innerHTML = text;
            container.appendChild(info);

            let fav = document.createElement('div');
            fav.className = 'fav_wrapper';
            addToggleOnHover(container, fav);
            let fav_icon = document.createElement('img');
            fav_icon.src = chrome.extension.getURL('img/icons/fav1.png');
            fav_icon.className = 'fav_icon';
            fav.appendChild(fav_icon);
            fav.onclick = () => {
                if (fav.parentNode.parentNode.parentNode.id == 'images') {
                    chrome.storage.local.get({ favourites: [] }, result => {
                        var favourites = result.favourites;
                        favourites.push({ imageKey: obj });
                        chrome.storage.local.set({ favourites: favourites });
                    })
                    fav_icon.src = chrome.extension.getURL('img/icons/fav2.png');
                    fav_icon.className = 'fav_icon fav_icon_added'
                    favourites_wrapp.style.display = 'block';

                    createFavourite(obj)
                    fav.parentNode.parentNode.remove()
                }
            }
            container.appendChild(fav);
        }

       

        chrome.storage.local.get('favourites', () => {
            for (let obj in data) {
                if (!data[obj].favourite) {
                    createDefault(obj);
                }
            };
        })

        search_input.oninput = searchImage(search_input.value, data);

        function removeFavourite(element, key) {
            createDefault(key)
            element.remove();
            chrome.storage.local.get({ favourites: [] }, result => {
                var favourites = result.favourites;
                let index = favourites.indexOf(key);
                favourites.splice(index - 1, 1)
                chrome.storage.local.set({ favourites: favourites }, () => {
                    chrome.storage.local.get('favourites', result => {
                        if (result.favourites.length === 0) {
                            favourites_wrapp.style.display = 'none';
                        }
                    })
                })
            })
        }

        function searchImage(value, data) {
            let filtered_data = [];
            for (item in data) {
                value = search_input.value.toLowerCase();
                let key = data[item].key.toLowerCase();

                if (key.includes(value)) {
                    filtered_data.push(data[item]);
                }
            }
            return filtered_data;
        }

        search_input.oninput = () => {
            let images = []
            let favs = []
            images = document.querySelectorAll(".imageContainer");
            
            for (img in images) {
                if (images[img].parentNode != undefined) {
                    images[img].parentNode.remove() 
                }
            }
      
            let toDisplay = searchImage(search_input.value, data)
            if (images.length === 0 ) {
                favourites_wrapp.style.display = 'none';
            }
            for (let obj in toDisplay) {
                let index;
                for (let i in data) {
                    if (toDisplay[obj].key === data[i].key) {
                        index = i;
                    }
                }
                
                if(data[index].favourite) {
                    favs.push(data[index]);
                    createFavourite(index);
                } else {
                    createDefault(index);
                }

                if (favs.length > 0) {
                    favourites_wrapp.style.display = 'block';
                } else {
                    favourites_wrapp.style.display = 'none';
                }
                
            }
        }

        let box_footer = document.createElement('div');
        box_footer.id = 'menu_wrapper_footer';
        box_footer.className = 'emoji_tabs clear_fix'
        let slider_container = document.createElement('div');
        slider_container.id = 'size_slider_container';
        let size_range = document.createElement('input');
        size_range.type = 'range';
        size_range.value = 26;
        size_range.min = 0;
        size_range.max = 88;
        size_range.id = 'size_range'
        let size_range_name = document.createElement('p');
        size_range_name.id = 'size_range_name';
        size_range_name.innerHTML = 'Размер рофланов: '
        let range_percent = document.createElement('p');
        range_percent.id = 'range_percent';
        range_percent.innerHTML = Math.round((size_range.value / 88) * 100) + '%';
        slider_container.appendChild(size_range_name);
        slider_container.appendChild(size_range);
        slider_container.appendChild(range_percent);
        box_footer.appendChild(slider_container);
        box.appendChild(box_footer);

        function setSizeToDefault() {
            size_range.value = 26;
            let newVal = parseInt(size_range.value) + 60;
            let images = scroll_overwflow.querySelectorAll('.imageContainer');
            images.forEach(image => {
                image.style.width = newVal + 'px';
                image.style.height = newVal + 'px';
                image.children[0].style.width = newVal + 'px';
                image.children[0].style.height = newVal + 'px';
            })
            range_percent.innerHTML = Math.round((size_range.value / 88) * 100) + '%';
        }
        size_range.ondblclick = () => {
            setSizeToDefault();
        }

        range_percent.onclick = () => {
            setSizeToDefault();
        }

        size_range.oninput = () => {
            let images = scroll_overwflow.querySelectorAll('.imageContainer');
            images.forEach(image => {
                let newVal = parseInt(size_range.value) + 60;
                image.style.width = newVal + 'px';
                image.style.height = newVal + 'px';
                image.children[0].style.width = newVal + 'px';
                image.children[0].style.height = newVal + 'px';
            });
            range_percent.innerHTML = Math.round((size_range.value / 88) * 100) + '%';
        }

        (function() {
            let sticker_wrapp = document.querySelector('.im-chat-input--mihail');
            if (sticker_wrapp === null) {
                sticker_wrapp = document.createElement('div');
                const input_buttons_wrapper = document.getElementsByClassName('im_chat-input--buttons')[0];
                sticker_wrapp.className = 'im-chat-input--mihail';
                input_buttons_wrapper.insertBefore(sticker_wrapp, input_buttons_wrapper.childNodes[2]);
                const sticker_icon = document.createElement('label');
                sticker_icon.className = 'im-chat-input--attach-label mihail'
                sticker_icon.style.background = `url(${chrome.extension.getURL('img/icons/sticker_icon.png')}) 50% no-repeat`
                sticker_icon.style.filter = 'none!important';
                sticker_wrapp.appendChild(sticker_icon);

                const sticker_block_wrapp = document.createElement('div');
                addToggleOnHover(sticker_wrapp, sticker_block_wrapp);

                sticker_block_wrapp.className = 'emoji_tt_wrap tt_down emoji_expanded mihail_wrapp';
                sticker_wrapp.appendChild(sticker_block_wrapp);

                const html = '<div class="emoji_block_cont" id="mihail_stickers_cont"> <div class="emoji_block_rel"> <div class="emoji_list_cont"> <div class="emoji_list ui_scroll_container ui_scroll_default_theme i_scroll_emoji_theme ui_scroll_no_transition_theme ui_scroll_shadow_bottom_visible" style="width: 275px; height: 242px;"> <div class="ui_scroll_overflow"> <div class="ui_scroll_blocker"> <div class="ui_scroll_outer" > <div class="ui_scroll_inner tt_noappend"> <div class="ui_scroll_content clear_fix"> <div class="emoji_scroll emoji_scroll_stickers"> <div class="clear emoji_stickers_spliter" id="emoji_tab_cont_-2_0"></div> <div class="emoji_recent_stickers_cont" id="emoji_recent_stickers_cont0"> </div> </div> <div class="ui_scroll_shadow_top"></div> <div class="ui_scroll_shadow_bottom"></div> <div class="ui_scroll_resize_sensor"> <div class="ui_scroll_resize_sensor ui_scroll_resize_expand"> <div style="width: 285px; height: 252px;"></div> </div> <div class="ui_scroll_resize_sensor ui_scroll_resize_shrink"> <div></div> </div> </div> </div> <div class="ui_scroll_resize_sensor"> <div class="ui_scroll_resize_sensor ui_scroll_resize_expand"> <div style="width: 285px; height: 14520px;"></div> </div> <div class="ui_scroll_resize_sensor ui_scroll_resize_shrink"> <div></div> </div> </div> </div> </div> </div> <div class="ui_scroll_shadow_top"></div> <div class="ui_scroll_shadow_bottom"></div> <div class="ui_scroll_resize_sensor"> <div class="ui_scroll_resize_sensor ui_scroll_resize_expand"> <div style="width: 285px; height: 252px;"></div> </div> <div class="ui_scroll_resize_sensor ui_scroll_resize_shrink"> <div></div> </div> </div> </div> <div class="ui_scroll_bar_container" style="display: none;> <div class="ui_scroll_bar_outer"> <div class="ui_scroll_bar_inner" style="height: 30px; transform: translateY(0px);"></div> </div> </div> </div> </div> </div> <div class="emoji_tabs clear_fix"><p class="stickers_title" style="opacity: 0.5">Mihai Stickers</p></div></div>'
                sticker_block_wrapp.innerHTML = html;

                chrome.storage.local.get({ 'vkaccess_token': {} }, item => {
                    if (item.vkaccess_token.length === undefined) {
                        const cont = document.querySelector('#mihail_stickers_cont')
                        cont.style.filter = 'blur(5px)'
                        const prompt_button_html = '<button class="flat_button im-page-action _im_page_action prompt_button" id="prompt_button">Разрешить доступ</button>'
                        const prompt_holder = document.createElement('div');
                        prompt_holder.className = 'emoji_block_cont prompt_holder'
                        prompt_holder.innerHTML = prompt_button_html;
                        sticker_block_wrapp.insertBefore(prompt_holder, sticker_block_wrapp.childNodes[0]);

                        document.querySelector('#prompt_button').addEventListener('click', () => {
                            chrome.runtime.sendMessage({ login: true })
                            chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
                                if (message.accessTokenReceived) {
                                    cont.style.filter = 'none';
                                    prompt_holder.style.display = 'none';
                                }
                            })
                        })
                    }
                })

                const stickers_wrapp = document.querySelector('#emoji_recent_stickers_cont0');

                stickers.forEach(sticker => {
                    let sticker_element = document.createElement('a');
                    sticker_element.className = 'emoji_sticker_item sticker_item_16583 __loaded';

                    sticker_element.onclick = function() { sendSticker(sticker.id, peer_type) };
                    stickers_wrapp.appendChild(sticker_element);
                    let sticker_prev = document.createElement('img');
                    sticker_prev.className = 'emoji_sticker_image';
                    sticker_prev.src = sticker.prev_url;
                    sticker_element.appendChild(sticker_prev);
                })
            } else return;
        }())
    } else {
        var type = Object.keys(message)[0];
        settings[type] = message[type];

        if (type == 'enableBackground') {
            let box = document.getElementById('menu_wrapper');

            if (!message[type]) {
                box.style = 'none';
            } else {
                box.style = 'background-image: url(https://imgur.com/0jgX0rk.gif);';
            }
        }
    }
})
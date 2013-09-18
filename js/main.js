function xmlhttpGet(searchUrl, type) {
    var xmlHttpReq = false;
    var self = this;
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject('Microsoft.XMLHTTP');
    }

    self.xmlHttpReq.open('GET', searchUrl, true);
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {
		    if (type == 'update') {
			    updatePage(self.xmlHttpReq.responseText);
			}
            if (type == 'expand') {
			    expandPageDetails(self.xmlHttpReq.responseText);
			}
        }
    }
    self.xmlHttpReq.send();
}

function updatePage(str) {
    var jsonObj = JSON.parse(str);
	var pages = jsonObj.data;
	var contentElem = document.getElementById('content');
	contentElem.innerHTML = '';
	
	for (var i = 0; i < pages.length; i++) {
	    var page = pages[i];
	    var name = page.name;
		var pid = page.id;
		var imageElem = document.createElement('img');
		if (sessionStorage.getItem(pid)) {
		    imageElem.setAttribute('src', 'images/star_full.png');
		} else {
		    imageElem.setAttribute('src', 'images/star_empty.png');
		}
		imageElem.setAttribute('onclick', 'toggleFavorite(event);');
		imageElem.className = 'star';
		var spanImageElem = document.createElement('span');
		spanImageElem.className = 'star-span';
		spanImageElem.appendChild(imageElem);
		var text = document.createTextNode(name);
	    var spanElem = document.createElement('span');
	    spanElem.className = 'name';
	    spanElem.appendChild(text);
	    var spanElem1 = document.createElement('span');
	    spanElem1.className = 'expand';
	    spanElem1.setAttribute('onclick', 'togglePage(event);');
		spanElem1.setAttribute('id', page.id);
	    var spanText1 = document.createTextNode('[+]');
	    spanElem1.appendChild(spanText1);
		
		var loadingElem = document.createElement('div');
		var loadingImgElem = document.createElement('img');
		loadingImgElem.setAttribute('src', 'images/loading.gif');
		loadingElem.appendChild(loadingImgElem);
		loadingElem.style.display = 'none';
				
	    var parentDivElem = document.createElement('div');
	    parentDivElem.className = 'page';
		parentDivElem.appendChild(spanImageElem);
	    parentDivElem.appendChild(spanElem);
	    parentDivElem.appendChild(spanElem1);
		parentDivElem.appendChild(loadingElem);
	    contentElem.appendChild(parentDivElem);
	}
		
	var pagingObj = jsonObj.paging;
	if (pagingObj.previous) {
	    var prev = document.getElementById('previous');
	    prev.style.display = 'block';
		prev.setAttribute('link', pagingObj.previous);
	} else {
	    document.getElementById('previous').style.display = 'none';
	}
	if (pagingObj.next) {
	    var next = document.getElementById('next');
	    next.style.display = 'block';
		next.setAttribute('link', pagingObj.next);
	} else {
	    document.getElementById('next').style.display = 'none';
	}
}

function expandPageDetails(str) {
    var jsonObj = JSON.parse(str);
	var id = jsonObj.id;
	var spanElem = document.getElementById(id);
	spanElem.nextSibling.style.display = 'none';
	spanElem.innerHTML = '';
	var text = document.createTextNode('[-]');
	spanElem.appendChild(text);
	
	var parentElem = spanElem.parentNode;
	var parentDivElem = document.createElement('div');
	parentDivElem.className = 'details';
	
	var divElem1 = document.createElement('div');
	var about = "";
	if (jsonObj.about) about = jsonObj.about;
	var data1 = 'About: ' + about;
	var doc1 = document.createTextNode(data1);
	divElem1.appendChild(doc1);
	parentDivElem.appendChild(divElem1);
	
	var divElem2 = document.createElement('div');
	var category = "";
	if (jsonObj.category) category = jsonObj.category;
	var data2 = 'Category: ' + category;
	var doc2 = document.createTextNode(data2);
	divElem2.appendChild(doc2);
	parentDivElem.appendChild(divElem2);
	
	var divElem3 = document.createElement('div');
	var website = "";
	if (jsonObj.website) website = jsonObj.website;
	var data3 = 'Website: ' + website;
	var doc3 = document.createTextNode(data3);
	divElem3.appendChild(doc3);
	parentDivElem.appendChild(divElem3);
	
	var divElem4 = document.createElement('div');
	var talking_about_count = "";
	if (jsonObj.talking_about_count) talking_about_count = jsonObj.talking_about_count;
	var data4 = 'People talking about it: ' + talking_about_count;
	var doc4 = document.createTextNode(data4);
	divElem4.appendChild(doc4);
	parentDivElem.appendChild(divElem4);
	
	var divElem5 = document.createElement('div');
	var likes = "";
	if (jsonObj.likes) likes = jsonObj.likes;
	var data5 = 'Likes: ' + likes;
	var doc5 = document.createTextNode(data5);
	divElem5.appendChild(doc5);
	parentDivElem.appendChild(divElem5);
	
	parentElem.appendChild(parentDivElem);
}

function searchPage(e) {
    if (typeof e == 'undefined' && window.event) { e = window.event; }
    if (e.keyCode == 13){
        var searchValue = document.getElementById('input-box').value;
		var searchUrl = 'https://graph.facebook.com/search?type=page&q=' + searchValue + '&access_token=416840185089236|AK2OxLpAHvbe-hzp2rkkpHedpCA';
		
		var contentElem = document.getElementById('content');
		contentElem.innerHTML = '';
		var divElem = document.createElement('div');
		var imageElem = document.createElement('img');
		imageElem.setAttribute('src', 'images/loading.gif');
		divElem.appendChild(imageElem);
		contentElem.appendChild(divElem);
        xmlhttpGet(searchUrl, 'update');
    }
}

function togglePage(e) {
    var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3)
		targ = targ.parentNode;
	
	var pageIdentifier = targ.getAttribute('id');
	if (document.getElementById(pageIdentifier).innerHTML.indexOf('+') != -1) expandPage(pageIdentifier);
	else if (document.getElementById(pageIdentifier).innerHTML.indexOf('-') != -1) collapsePage(pageIdentifier);
}

function expandPage(id) {
    document.getElementById(id).nextSibling.style.display = 'block';
	var searchUrl = 'https://graph.facebook.com/' + id;
    xmlhttpGet(searchUrl, 'expand');
}

function collapsePage(id) {
    var elem = document.getElementById(id);
	elem.innerHTML = '';
	var text = document.createTextNode('[+]');
	elem.appendChild(text);
	var siblingElem = elem.nextSibling.nextSibling;
	elem.parentNode.removeChild(siblingElem);
}

function displayPreviousPage(e) {
    var contentElem = document.getElementById('content');
	contentElem.innerHTML = '';
	var divElem = document.createElement('div');
	var imageElem = document.createElement('img');
	imageElem.setAttribute('src', 'images/loading.gif');
	divElem.appendChild(imageElem);
	contentElem.appendChild(divElem);
	var plink = document.getElementById('previous').getAttribute('link');
	xmlhttpGet(plink, 'update');
}

function displayNextPage(e) {
    var contentElem = document.getElementById('content');
	contentElem.innerHTML = '';
	var divElem = document.createElement('div');
	var imageElem = document.createElement('img');
	imageElem.setAttribute('src', 'images/loading.gif');
	divElem.appendChild(imageElem);
	contentElem.appendChild(divElem);
	var nlink = document.getElementById('next').getAttribute('link');
	xmlhttpGet(nlink, 'update');
}

function toggleFavorite(e) {
    var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3)
		targ = targ.parentNode;
	
	var imageSrc = targ.getAttribute('src');
	if (imageSrc.indexOf('empty') != -1) {
	    targ.setAttribute('src', 'images/star_full.png');
		var parentElem = targ.parentNode;
		var nsibling = parentElem.nextSibling;
		var tname = nsibling.innerHTML;
		var ntsibling = nsibling.nextSibling;
		var tid = ntsibling.getAttribute('id');
		//sessionStorage.setItem(tname, tid);
		sessionStorage.setItem(tid, tname);
	} else if (imageSrc.indexOf('full') != -1) {
	    targ.setAttribute('src', 'images/star_empty.png');
		var parentElem = targ.parentNode;
		var nsibling = parentElem.nextSibling.nextSibling;
		var tnid = nsibling.getAttribute('id');
		for (var i = 0; i < sessionStorage.length; i++){
            var keyId = sessionStorage.key(i);
            if (keyId === tnid) {
			    sessionStorage.removeItem(tnid);
			}
        } 
	}
}

function displayFavoritePages(e) {
    var contentElem = document.getElementById('content');
	contentElem.innerHTML = '';
	for (var i = 0; i < sessionStorage.length; i++){
		var keyId = sessionStorage.key(i);
		var keyName = sessionStorage.getItem(keyId);
		var text = document.createTextNode(keyName);
	    var spanElem = document.createElement('span');
	    spanElem.className = 'name';
	    spanElem.appendChild(text);
		var spanElem1 = document.createElement('span');
	    spanElem1.className = 'expand';
	    spanElem1.setAttribute('onclick', 'togglePage(event);');
		spanElem1.setAttribute('id', keyId);
	    var spanText1 = document.createTextNode('[+]');
	    spanElem1.appendChild(spanText1);
		
		var loadingElem = document.createElement('div');
		var loadingImgElem = document.createElement('img');
		loadingImgElem.setAttribute('src', 'images/loading.gif');
		loadingElem.appendChild(loadingImgElem);
		loadingElem.style.display = 'none';
		
		var parentDivElem = document.createElement('div');
	    parentDivElem.className = 'page';
		parentDivElem.appendChild(spanElem);
	    parentDivElem.appendChild(spanElem1);
		parentDivElem.appendChild(loadingElem);
	    contentElem.appendChild(parentDivElem);
	}
}
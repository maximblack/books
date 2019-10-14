
function storeSet(key, val) {
  if (window.localStorage) {
    window.localStorage.setItem(key, val);
  }
}

function storeClear(key) {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

function storeGet(key) {
  if (window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return "";
}

var keyScrollPos = "scrollPos";
var keyIndexView = "indexView";

function viewSet(view) {
  storeSet(keyIndexView, view);
}

function viewGet() {
  return storeGet(keyIndexView);
}

function viewClear() {
  storeClear(keyIndexView);
}

// rv = rememberView but short because it's part of url
function rv(view) {
  //console.log("rv:", view);
  viewSet(view);
}

// accessor functions for items in gBookToc array:
// 	[${chapter or aticle url}, ${parentIdx}, ${title}, ${synonim 1}, ${synonim 2}, ...],
// as generated in gen_book_toc_search.go and stored in books/${book}/toc_search.js

var itemIdxURL = 1;
var itemIdxParent = 2;
var itemIdxFirstChild = 3;
var itemIdxTitle = 4;
var itemIdxFirstSynonym = 5;

function tocItemFirstChildIdx(item) {
  return item[itemIdxFirstChild];
}

function tocItemHasChildren(item) {
  return tocItemFirstChildIdx(item) != -1;
}

// returns true if has children and some of them articles
// (as opposed to children that are headers within articles)
function tocItemHasArticleChildren(item) {
  var idx = tocItemFirstChildIdx(item);
  if (idx == -1) {
    return false;
  }
  var item = gBookToc[idx];
  var parentIdx = item[itemIdxParent];
  while (idx < gBookToc.length) {
    item = gBookToc[idx];
    if (parentIdx != item[itemIdxParent]) {
      return false;
    }
    var uri = item[itemIdxURL];
    if (uri.indexOf("#") === -1) {
      return true;
    }
    idx += 1;
  }
  return false;
}

function tocItemParent(item) {
  var idx = tocItemParentIdx(item);
  if (idx == -1) {
    return null;
  }
  return gBookToc[idx];
}

function tocItemParentIdx(item) {
  return item[itemIdxParent];
}

function tocItemTitle(item) {
  return item[itemIdxTitle];
}

// all searchable items: title + search synonyms
function tocItemSearchable(item) {
  return item.slice(itemIdxTitle);
}

function showcontact() {
  var el = document.getElementById("contact-form");
  el.style.display = "block";
  el = document.getElementById("contact-page-url");
  var uri = window.location.href;
  //uri = uri.replace("#", "");
  el.value = uri;
  el = document.getElementById("msg-for-chris");
  el.focus();
}

function hidecontact() {
  var el = document.getElementById("contact-form");
  el.style.display = "none";
}

function start() {
  //console.log("started");

  // if this is chapter or article, we generate toc
  /*
  var scrollTop = scrollPosGet() || -1;
  if (scrollTop >= 0) {
    //console.log("scrollTop:", scrollTop);
    var el = document.getElementById("toc");
    el.scrollTop = scrollTop;
    scrollPosClear();
    return;
  }
  */
  /*
  function makeTocVisible() {
    var el = document.getElementById(tocItemElementID);
    if (el) {
      scrollElementIntoView(el, true);
    } else {
      console.log(
        "tried to scroll toc item to non-existent element with id: '" +
        tocItemElementID +
        "'"
      );
    }
  }
  window.requestAnimationFrame(makeTocVisible);
  */
}

function updateLinkHome() {
  var view = viewGet();
  if (!view) {
    return;
  }
  var uri = "/";
  if (view === "list") {
    // do nothing
  } else if (view == "grid") {
    uri = "/index-grid";
  } else {
    console.log("unknown view:", view);
    viewClear();
  }
  var el = document.getElementById("link-home");
  if (el && el.href) {
    //console.log("update home url to:", uri);
    el.href = uri;
  }
}



function doAppPage() {
  // we don't want this in e.g. about page
  document.addEventListener("DOMContentLoaded", start);
}

function doIndexPage() {
  var view = viewGet();
  var loc = window.location.pathname;
  //console.log("doIndexPage(): view:", view, "loc:", loc);
  if (!view) {
    return;
  }
  if (view === "list") {
    if (loc === "/index-grid") {
      window.location = "/";
    }
  } else if (view === "grid") {
    if (loc === "/") {
      window.location = "/index-grid";
    }
  } else {
    console.log("Unknown view:", view);
  }
}

// we don't want to run javascript on about etc. pages
var loc = window.location.pathname;
var isAppPage = loc.indexOf("essential/") != -1;
var isIndexPage = loc === "/" || loc === "/index-grid";

function httpsRedirect() {
  if (window.location.protocol !== "http:") {
    return;
  }
  if (window.location.hostname !== "www.programming-books.io") {
    return;
  }
  var uri = window.location.toString();
  uri = uri.replace("http://", "https://");
  window.location = uri;
}

if (isIndexPage) {
  doIndexPage();
} else if (isAppPage) {
  doAppPage();
}
updateLinkHome();
httpsRedirect();

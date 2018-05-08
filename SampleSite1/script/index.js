window.addEventListener("DOMContentLoaded", function () {
    ChangePage("home");
});
window.addEventListener("popstate", function (e) {
    ShowContentSection(e.state.page);
});
function ChangePage(startSection) {
    if (startSection) {
        var regEx = /blog-(\w+)/;
        if (regEx.test(startSection)) {
            ShowBlogItem(startSection.match(regEx)[1]);
        }
        else {
            ShowContentSection(startSection);
        }
    }
    else {
        ShowContentSection("home");
    }
}
function ShowContentSection(sectionName) {
    var allSections = document.querySelectorAll("#content-sections > section");
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].setAttribute("hidden", "");
    }
    var navItems = document.querySelectorAll(".navbar-list-item");
    for (var j = 0; j < navItems.length; j++) {
        navItems[j].classList.remove("active");
    }
    var activeItem = document.querySelector(".navbar-list-item[data-show='" + sectionName + "']");
    if (activeItem)
        activeItem.classList.add("active");
    history.pushState({ page: sectionName }, sectionName, "?page=" + sectionName);
    var section = document.getElementById(sectionName);
    if (section != null) {
        section.removeAttribute("hidden");
    }
    else {
        var sectionContent = GetContent(sectionName);
        if (sectionContent != null) {
            section = document.createElement("section");
            section.id = sectionName;
            section.innerHTML = sectionContent;
            var contentSections = document.getElementById("content-sections");
            contentSections.appendChild(section);
            if (sectionName === "blogIndex") {
                LoadIndex(section);
            }
            if (sectionName === "resume") {
                var resumeContent = document.getElementById("resumeContent");
                resumeContent.addEventListener("scroll", OnResumeScroll);
                OnResumeScroll();
                window.addEventListener("resize", AdjustResumeContentHeight);
                AdjustResumeContentHeight();
            }
        }
    }
}
function AdjustResumeContentHeight() {
    var resumeContent = document.getElementById("resumeContent");
    resumeContent.style.height = (window.innerHeight - resumeContent.getBoundingClientRect().top - 40) + "px";
}
function GetContent(section) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sections/" + section + ".html", false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    }
    else {
        return "<p>Page not found</p>";
    }
}
function LoadIndex(container) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/Blog/", false);
    xhr.send();
    var items = JSON.parse(xhr.responseText);
    var index = container.querySelector("#index-container");
    var template = index.querySelector(".template");
    for (var i = 0; i < items.length; i++) {
        var clone = template.cloneNode(true);
        var blogStruct = clone.querySelector(".blog-item");
        blogStruct.setAttribute("data-blog-id", items[i].id);
        blogStruct.querySelector(".title").textContent = items[i].title;
        blogStruct.querySelector(".description").textContent = items[i].description;
        blogStruct.querySelector(".date").textContent = new Date(items[i].date).toLocaleString();
        if (items[i].headlinePhotoURL) {
            blogStruct.style.backgroundImage = "url('" + items[i].headlinePhotoURL + "')";
        }
        clone.classList.remove("template");
        blogStruct.addEventListener("click", function (e) {
            ChangePage("blog-" + e.currentTarget.getAttribute("data-blog-id"));
        });
        index.appendChild(clone);
    }
}
function LoadBlogItem(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/Blog/" + id, false);
    xhr.send();
    var item = JSON.parse(xhr.responseText);
    return item;
}
function ShowBlogItem(blogID) {
    var blogItem = LoadBlogItem(blogID);
    ShowContentSection("blogItem");
    var item = document.getElementById("blogItem");
    item.querySelector(".title").textContent = blogItem.title;
    item.querySelector(".description").textContent = blogItem.description;
    item.querySelector(".date").textContent = new Date(blogItem.date).toLocaleString();
    item.querySelector(".blog-content").innerHTML = blogItem.contentHTML;
}
function NewBlogPost() {
    var item = {};
    item.title = document.querySelector("#blogIndex form .title").value;
    item.description = document.querySelector("#blogIndex form .description").value;
    item.contentHTML = document.querySelector("#blogIndex form .contentHTML").value;
    item.headlinePhotoURL = document.querySelector("#blogIndex form .headlinePhotoURL").value;
    item.date = new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/Blog", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
    console.log(xhr.responseText);
    //var item = JSON.parse(xhr.responseText) as BlogItem;
}
function makeCurrent(e) {
    e.preventDefault();
    var a = e.currentTarget;
    var parent = a.parentElement;
    var selected = parent.querySelectorAll("a.current");
    for (var i = 0; i < selected.length; i++) {
        selected[i].classList.remove("current");
        highlightItem(selected[i], false);
    }
    highlightItem(a, true);
    a.classList.add("current");
}
function highlightItem(a, add) {
    var item = document.querySelector(a.getAttribute("href"));
    if (item) {
        if (add) {
            item.classList.add("current-item");
            item.scrollIntoView(true);
        }
        else
            item.classList.remove("current-item");
    }
}
function IndicateCurrent(id, divs) {
    var navs = document.querySelectorAll("#resumeNav > a");
    for (var i = 0; i < navs.length; i++) {
        if (navs[i].getAttribute("href") === "#" + id)
            navs[i].classList.add("current");
        else
            navs[i].classList.remove("current");
    }
    for (var i = 0; i < divs.length; i++) {
        if (divs[i].id === id)
            divs[i].classList.add("current-item");
        else
            divs[i].classList.remove("current-item");
    }
}
function OnResumeScroll() {
    var resumeContent = document.getElementById("resumeContent");
    var divs = document.querySelectorAll("#resumeContent > div");
    var sTop = resumeContent.scrollTop;
    for (var i = 0; i < divs.length; i++) {
        var top = divs[i].offsetTop;
        if (top >= sTop) {
            IndicateCurrent(divs[i].id, divs);
            break;
        }
    }
}
function ShowPortfolioItem(url, el) {
    var frameWrapper = document.getElementById("frame-wrapper");
    var loadingWrapper = document.getElementById("loading-wrapper");
    var anchors = document.querySelectorAll("#portfolio-nav a");
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].classList.remove("active");
    }
    el.classList.add("active");
    frameWrapper.setAttribute("hidden", "");
    var spinner = loadingWrapper.querySelector(".fa-spinner");
    spinner.classList.add("fa-spin");
    loadingWrapper.removeAttribute("hidden");
    var frame = document.getElementById("websiteFrame");
    frame.style.height = (window.innerHeight - frame.offsetTop - 200) + "px";
    frame.addEventListener("load", OnIFrameLoaded);
    frame.src = url;
    function OnIFrameLoaded() {
        spinner.classList.remove("fa-spin");
        loadingWrapper.setAttribute("hidden", "");
        frameWrapper.removeAttribute("hidden");
        frame.removeEventListener("load", OnIFrameLoaded);
    }
}
//# sourceMappingURL=index.js.map
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("hashchange", OnHashChange, false);
    OnHashChange();
});
function OnHashChange() {
    var locationHash = window.location.hash;
    if (locationHash && locationHash.length > 1) {
        var startSection = locationHash.substr(1);
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
        }
    }
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
            location.hash = "#blog-" + e.currentTarget.getAttribute("data-blog-id");
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
//# sourceMappingURL=index.js.map
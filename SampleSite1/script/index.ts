document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("hashchange", OnHashChange, false);
    OnHashChange();
});

function OnHashChange(): void {
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

function ShowContentSection(sectionName: string): void {
    var allSections = document.querySelectorAll("#content-sections > section");
    for (var i = 0; i < allSections.length; i++) {
        allSections[i].setAttribute("hidden", "");
    }

    var navItems = document.querySelectorAll(".navbar-list-item");
    for (var j = 0; j < navItems.length; j++) {
        navItems[j].classList.remove("active");
    }
    var activeItem = document.querySelector(`.navbar-list-item[data-show='${sectionName}']`);
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

function GetContent(section: string): string {
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


function LoadIndex(container: HTMLElement): void {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/Blog/", false);
    xhr.send();

    var items = JSON.parse(xhr.responseText) as Array<BlogItem>;
    var index = container.querySelector("#index-container");
    var template = index.querySelector(".template");

    for (var i = 0; i < items.length; i++) {
        var clone = template.cloneNode(true) as HTMLElement;
        var blogStruct = clone.querySelector(".blog-item") as HTMLElement;
        blogStruct.setAttribute("data-blog-id", items[i].id);
        blogStruct.querySelector(".title").textContent = items[i].title;
        blogStruct.querySelector(".description").textContent = items[i].description;
        blogStruct.querySelector(".date").textContent = new Date(items[i].date).toLocaleString();
        if (items[i].headlinePhotoURL) {
            blogStruct.style.backgroundImage = `url('${items[i].headlinePhotoURL}')`;
        }
        clone.classList.remove("template");
        blogStruct.addEventListener("click", e => {
            location.hash = `#blog-${(e.currentTarget as HTMLElement).getAttribute("data-blog-id")}`;
        });
        index.appendChild(clone);
    }
}

function LoadBlogItem(id: string): BlogItem {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/Blog/" + id, false);
    xhr.send();

    var item = JSON.parse(xhr.responseText) as BlogItem;
    return item;
}

function ShowBlogItem(blogID: string) {
    var blogItem = LoadBlogItem(blogID);

    ShowContentSection("blogItem");
    var item = document.getElementById("blogItem");
    item.querySelector(".title").textContent = blogItem.title;
    item.querySelector(".description").textContent = blogItem.description;
    item.querySelector(".date").textContent = new Date(blogItem.date).toLocaleString();
    item.querySelector(".blog-content").innerHTML = blogItem.contentHTML;
}

interface BlogItem {
    title: string;
    description: string;
    id: string;
    date: string;
    contentHTML: string;
    headlinePhotoURL: string;
}

function NewBlogPost(): void {

    var item = {} as BlogItem;
    item.title = (document.querySelector("#blogIndex form .title") as HTMLInputElement).value;
    item.description = (document.querySelector("#blogIndex form .description") as HTMLInputElement).value;
    item.contentHTML = (document.querySelector("#blogIndex form .contentHTML") as HTMLInputElement).value;
    item.headlinePhotoURL = (document.querySelector("#blogIndex form .headlinePhotoURL") as HTMLInputElement).value;
    item.date = new Date().toISOString();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/Blog", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
    console.log(xhr.responseText);

    //var item = JSON.parse(xhr.responseText) as BlogItem;
}

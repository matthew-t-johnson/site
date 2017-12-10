"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Blog = /** @class */ (function () {
    function Blog() {
    }
    Blog.LoadIndex = function (container) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/Blog/", false);
        xhr.send();
        var items = JSON.parse(xhr.responseText);
        var index = container.querySelector("#index-container");
        var template = index.querySelector(".template");
        for (var i = 0; i < items.length; i++) {
            var clone = template.cloneNode(true);
            clone.querySelector(".title").textContent = items[i].title;
            clone.querySelector(".description").textContent = items[i].description;
        }
    };
    return Blog;
}());
exports.default = Blog;
//# sourceMappingURL=blog.js.map
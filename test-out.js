"use strict";

var React = require("react");

(function () {
    var style = document.createElement("style");
    style.innerHTML = ".-testjs-1{color:blue;font-size:10px;}";
    document.head.appendChild(style);
})();

var outerClass = "-testjs-1";

(function () {
    var style = document.createElement("style");
    style.innerHTML = ".-testjs-2{display:inline-block;}";
    document.head.appendChild(style);
})();

var MyComponent = React.createClass({
    displayName: "MyComponent",

    render: function render() {
        return React.createElement(
            "div",
            { className: outerClass },
            React.createElement(
                "span",
                { className: "-testjs-2" },
                "Hello, world!"
            )
        );
    }
});

module.exports = MyComponent;

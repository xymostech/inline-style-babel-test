const React = require("react");

const outerClass = Style({
    color: "blue",
    "font-size": "10px",
});

const MyComponent = React.createClass({
    render: function() {
        return <div className={outerClass}>
            <span className={Style({ display: "inline-block" })}>
                Hello, world!
            </span>
        </div>;
    }
});

module.exports = MyComponent;

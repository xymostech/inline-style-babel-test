const babel = require("babel");

babel.transformFile("./test.js", {
    plugins: ["my-transform"]
}, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result.code);
    }
});

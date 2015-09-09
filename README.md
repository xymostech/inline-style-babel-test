# Testing Inline Style Babel Transform

This is a repo to test out inline-style babel transforms. For example, this
transform takes a `Style({...})` function call and turns it into a class name
while automatically adding CSS to the DOM.

See an example in the [test.js](test.js) -> [test-out.js](test-out.js) transform.

The actual transformation code can be found in
[my-transform/index.js](my-transform/index.js).

### Running

Run

```
npm install
./node_modules/.bin/babel-node transform.js
```

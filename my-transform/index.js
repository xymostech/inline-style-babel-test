module.exports = function(babel) {
    var t = babel.types;

    var count = 1;

    function outerParentOf(node) {
        var parent = node;
        do {
            node = parent;
            parent = node.parentPath;
        } while (parent.type !== "Program");

        return node;
    }

    var count = 1;
    function getClassNameFromFileName(filename) {
        var className =
            filename
                .replace(/\//g, '-')
            .replace(/[^\w-]/g, '') + "-" + count;
        count += 1;
        return className;
    }

    function makeCSSDeclaration(className, declarations) {
        var declaration = "." + className + "{";

        for (var i = 0; i < declarations.length; i++) {
            declaration += declarations[i][0] + ":" + declarations[i][1] + ";";
        }

        declaration += "}";

        return declaration;
    }

    function buildCSSDeclarations(args) {
        var decls = [];

        for (var i = 0; i < args.length; i++) {
            if (args[i].type !== "ObjectExpression") {
                throw new Error("Can only use ObjectExpressions in Style function.");
            }

            var props = args[i].properties;
            for (var j = 0; j < props.length; j++) {
                var decl = [];

                var key = props[j].key;
                var value = props[j].value;
                if (key.type === "Identifier") {
                    decl.push(key.name);
                } else if (key.type === "Literal") {
                    decl.push(key.value);
                } else {
                    throw new Error("Can only use Indentifiers and Literals as keys in Style function.");
                }

                if (value.type === "Literal") {
                    decl.push(value.value);
                } else {
                    throw new Error("Can only use Literals as values in Style function.");
                }

                decls.push(decl);
            }
        }

        return decls;
    }

    function makeStyleAdder(css) {
        return [
            t.expressionStatement(t.callExpression(
                t.functionExpression(
                    null,
                    [],
                    t.blockStatement([
                        t.variableDeclaration(
                            "var",
                            [
                                t.variableDeclarator(
                                    t.identifier("style"),
                                    t.callExpression(
                                        t.memberExpression(t.identifier("document"), t.identifier("createElement"), false),
                                        [t.literal("style")]
                                    )
                                )
                            ]
                        ),
                        t.expressionStatement(
                            t.assignmentExpression(
                                "=",
                                t.memberExpression(t.identifier("style"), t.identifier("innerHTML"), false),
                                t.literal(css)
                            )
                        ),
                        t.expressionStatement(
                            t.callExpression(
                                t.memberExpression(
                                    t.memberExpression(t.identifier("document"), t.identifier("head"), false),
                                    t.identifier("appendChild"),
                                    false
                                ),
                                [t.identifier("style")]
                            )
                        ),
                    ])),
                []
            )),
        ];
    }

    return new babel.Transformer("my-transform", {
        CallExpression: function(node, parent, source, file) {
            if (node.callee.name === "Style") {
                var className = getClassNameFromFileName(file.opts.sourceFileName);
                var outerParent = outerParentOf(this);

                outerParent.insertBefore(
                    makeStyleAdder(
                        makeCSSDeclaration(
                            className,
                            buildCSSDeclarations(node.arguments)
                        )
                    )
                    /*t.expressionStatement(t.literal(
                        makeCSSDeclaration(
                            className,
                            buildCSSDeclarations(node.arguments)
                        )
                    ))*/
                );

                return t.expressionStatement(t.literal(className));
            }
        }
    });
};

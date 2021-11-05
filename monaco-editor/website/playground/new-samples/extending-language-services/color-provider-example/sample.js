monaco.languages.register({
    id: "colorLanguage"
})

monaco.editor.create(document.getElementById("container"), {
    value: "red\nblue\ngreen",
    language: "colorLanguage",
    colorDecorators: true
});

monaco.languages.registerColorProvider("colorLanguage", {
    provideColorPresentations: (model, colorInfo) => {
        var color = colorInfo.color;
        var red256 = Math.round(color.red * 255);
        var green256 = Math.round(color.green * 255);
        var blue256 = Math.round(color.blue * 255);
        var label;
        if (color.alpha === 1) {
            label = "rgb(" + red256 + ", " + green256 + ", " + blue256 + ")";
        } else {
            label = "rgba(" + red256 + ", " + green256 + ", " + blue256 + ", " + color.alpha + ")";
        }

        return [
            {
                label: label
            }
        ];
    },

    provideDocumentColors: () => {
        return [
            {
                color: { red: 1, blue: 0, green: 0, alpha: 1 },
                range:{
                    startLineNumber: 1,
                    startColumn: 0,
                    endLineNumber: 1,
                    endColumn: 0
                }
            },
            {
                color: { red: 0, blue: 1, green: 0, alpha: 1 },
                range:{
                    startLineNumber: 2,
                    startColumn: 0,
                    endLineNumber: 2,
                    endColumn: 0
                }
            },
            {
                color: { red: 0, blue: 0, green: 1, alpha: 1 },
                range:{
                    startLineNumber: 3,
                    startColumn: 0,
                    endLineNumber: 3,
                    endColumn: 0
                }
            }
        ]
    }

})
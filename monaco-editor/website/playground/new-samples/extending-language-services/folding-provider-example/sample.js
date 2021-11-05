monaco.languages.register({
    id: "foldLanguage"
});

var value =
`1. Hit F1 to bring up the Command Palette
2. Type 'fold'
3. Choose 'Fold All Block Comments' or 'Fold All Regions'

5. comment1
6. comment1
7. comment1

9. unfoldable text
10. unfoldable text
11. unfoldable text

13. comment2
14. comment2
15. comment2
16. comment2
17. comment2

19. foldable text
20. foldable text
21. foldable text

23. region1
24. region1
25. region1

27. region2
28. region2
29. region2`

monaco.editor.create(document.getElementById("container"), {
    value: value,
    language: "foldLanguage"
});

monaco.languages.registerFoldingRangeProvider("foldLanguage", {
    provideFoldingRanges: function(model, context, token) {
        return [
            // comment1
            {
                start: 5,
                end: 7,
                kind: monaco.languages.FoldingRangeKind.Comment
            },
            // comment2
            {
                start: 13,
                end: 17,
                kind: monaco.languages.FoldingRangeKind.Comment
            },
            // foldable text
            {
                start: 19,
                end: 21
            },
            // region1
            {
                start: 23,
                end: 25,
                kind: monaco.languages.FoldingRangeKind.Region
            },
            // region2
            {
                start: 27,
                end: 29,
                kind: monaco.languages.FoldingRangeKind.Region
            }
        ];
    }
});
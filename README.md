This is a 3 part repo test 

1) remark plugin that finds "alternative" footnotes which look like:

```
Here is the first reference [%note].

[%note]: Definition of the aside note

Some more text
```

2) rehype handler which renders them as sidenotes using https://edwardtufte.github.io/tufte-css/ and https://gwern.net/sidenote as inspiration.

3) Carta plugin based on https://github.com/maisonsmd/carta-plugin-subscript that incorporates it into the editor

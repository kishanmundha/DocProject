Markdown
==========================
**************************

Markdown enables faster creating and editing of posts, documents.


It makes it also easier to capture texts that subsequently can be used in various output streams, without copy/pasting and reformatting for these various output streams:
- blogs
- eBooks
- paper books
- Word documents, PDF documents



### Heading

```html
# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading
```

### Add Horizontal Rules (`<hr/>`)

We can add `<hr/>` with any of the following:

* `___` : three consecutive underscores
* `---` : three consecutive dashes
* `***` : three consecutive asterisks

### New Line

In markdown, when we started text from new line, it consider in same paragraph.
So when we need new line, We keep space between two lines.

### Font styles

```
**Bold text**

__Bold text__

*Italic text*

_Italic text_

***Bold italic text***

___Bold italic text___

~~Strikethrough text~~
```

### Blockquotes

```
> Blockquotes paragraph
```

### Lists

#### Unordered

```
* valid bullet
- valid bullet
+ valid bullet
```

#### Ordered

```
1. List item 1
2. List item 2
```

### Code

#### Inline code
For inline code use <code>&#96;int&#96;</code>

#### Block code

Use "fences"  <code>&#96;&#96;&#96;</code> to block in multiple lines of code.

<pre>
&#96;&#96;&#96; javascript
var a = 0;
&#96;&#96;&#96;
</pre>

This will render as
``` javascript
var a = 0;
```

### Tables

``` html
| Column1 | Column2 |
| ------- | ------- |
| 1       | value1  |
| 2       | value 2 |
```

| Column1 | Column2 |
| ------- | ------- |
| 1 | value1 |
| 2 | value 2 |

> To set right alignment of text in a table column use `| -----: |`

### Link

```
[Google](http://www.google.com "Google")
```

In this `[Google]` is text which was render and after that link and title (optional)

### Image

```
![test](/data/img/dms/design.jpg)
```

We just use `!` before link for image
# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>` or CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Font Usage

- **Headings:** Inter (weights 600-700 for titles, 500-600 for subheadings)
- **Body text:** Inter (weight 400 for body, 500 for emphasis)
- **Code/technical:** JetBrains Mono (monospace for code, data, IDs)

## CSS Application

```css
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

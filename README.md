<h1 align="center">
  <br>
    <img src="./logo.png" alt="logo" width="200">
  <br><br>
  Angular Component Extractor
  <br>
  <br>
</h1>

<h4 align="center">Extract Angular Components based on editor selection</h4>

## Description

This extension for VS Code makes it easier to split components in an Angular project. Within a template you can select the part which should be extracted. Then another component is generated in the same directory using the Angular CLI.

## How to use

![Preview](./images/preview.gif)

## Configuration

Angular generates component with a prefix. This prefix can be customized via VS Code settings:

```json
{
  "angular-component-extractor.default-prefix": "app"
}
```

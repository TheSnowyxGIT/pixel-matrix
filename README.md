# Pixels Matrix

## Overview

This Lib provides utility to manage 2D pixels matrices, specifically focusing on pixel and color data manipulations, ideal for LED matrix handling.

## Installation

Install via NPM:

```shell
npm install --save pixels-matrix
```

## Key Features

- **Pixel Management**: Handle pixel data in a 2D matrix.
- **Color Handling**: Manage colors using different formats (RGB, HEX, and HSV).
- **Flexible Configurations**: Adapt matrix rendering through customizable options.

## Basic Usage

### Pixel Matrix

```js
import { PixelMatrix, Point, Color } from "pixels-matrix";

// Initialize PixelMatrix
const matrix = new PixelMatrix(8, 8);

// Set a pixel color using Point and Color
const point: Point = { x: 2, y: 3 };
const color: Color = Color.FromHEX("#ff5733");
matrix.setColor(point, color);

// Get a pixel color
const retrievedColor: Color = matrix.getColor(point);

// Fill the entire matrix with a color
matrix.fillColor(Color.Blue);

// Convert PixelMatrix data to array
const pixelArray: Uint32Array = matrix.ToArray();
```

### Color Handling

```js
import { Color } from "pixels-matrix";

// Create color using various formats
const colorFromRGB = Color.FromRGB(255, 87, 34);
const colorFromHEX = Color.FromHEX("#FF5722");
const colorFromHSV = Color.FromHSV(0.05, 0.66, 1);

// Retrieve uint32 data from color
const uint32Color = colorFromRGB.getUint32();
// Retrieve rgb data from color
const [r, b, g] = colorFromRGB.getRGB();
```

## Options

### MatrixOptions

`MatrixOptions` allows you to control the appearance of the pixel matrix.

- `x_mirrored` (default `false`): Mirror the matrix horizontally.
- `y_mirrored` (default `false`): Mirror the matrix vertically.
- `zigzag` (default `true`): Enable zigzag rendering.

Example:

```js
const options = {
  x_mirrored: true,
  y_mirrored: false,
  zigzag: true,
};
const matrix = new PixelMatrix(8, 8, options);
```

## API Reference

### Class: PixelMatrix

- **Methods**:
  - `getColor(point: Point): Color`: Get color of the pixel at given point.
  - `setColor(point: Point, color: Color): void`: Set color of the pixel at given point.
  - `fillColor(color: Color): void`: Fill the entire matrix with a specified color.
  - `getCoord(index: number): Point`: Get matrix coordinates from a linear index.
  - `getIndex(point: Point)`: number: Get linear index from matrix coordinates.
  - `ToArray(): Uint32Array`: Convert matrix data to a typed array.

### Class: Color

- **Static Methods**:
  - Various utility methods to create Color instances from different formats.
- **Methods**:
  - `getUint32(): number`: Convert color to uint32 format.
  - `getRGB(): [number, number, number]`: Convert color to rgb format.

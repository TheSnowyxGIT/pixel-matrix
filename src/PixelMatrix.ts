import { Color } from "./Colors";

/* Basic Point interface */
export interface Point {
  x: number;
  y: number;
}

/* Options for the PixelMatrix class */
interface MatrixOptions {
  x_mirrored?: boolean;
  y_mirrored?: boolean;
  zigzag?: boolean;
}

type SetMatrixOption = {
  xOffset?: number;
  yOffset?: number;
};

export class PixelMatrix {
  static FromBuffer(
    arrayBuffer: ArrayBuffer,
    width: number,
    height: number,
    options?: MatrixOptions
  ): PixelMatrix {
    const pm = new PixelMatrix(width, height, options);
    const buffer = Buffer.from(arrayBuffer);
    pm.pixels_ = new Uint32Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.length / 4
    );
    return pm;
  }

  private pixels_: Uint32Array;

  private width_: number;
  private height_: number;

  private options_: MatrixOptions;

  constructor(width: number, height: number, options?: MatrixOptions) {
    const defaultOptions: MatrixOptions = {
      x_mirrored: false,
      y_mirrored: false,
      zigzag: false,
    };
    this.options_ = { ...defaultOptions, ...options };

    this.pixels_ = new Uint32Array(height * width);
    this.height_ = height;
    this.width_ = width;
  }

  private isOutOfBound(point: Point): boolean {
    if (
      point.x < 0 ||
      point.x >= this.width_ ||
      point.y < 0 ||
      point.y >= this.height_
    ) {
      return true;
    }
    return false;
  }

  public getColor(point: Point): Color {
    if (this.isOutOfBound(point)) {
      return Color.FromHEX("#000000");
    }
    const index = this.getIndex(point);
    return Color.FromUint32(this.pixels_[index]);
  }

  public clear(): void {
    this.fillColor(Color.Black);
  }

  public setColor(point: Point, color: Color): void {
    if (!this.isOutOfBound(point)) {
      const index = this.getIndex(point);
      this.pixels_[index] = Color.blendColor(
        this.getColor(point),
        color
      ).getUint32();
    }
  }

  public fillColor(color: Color): void {
    for (let i = 0; i < this.width_ * this.height_; i++) {
      this.pixels_[i] = Color.blendColor(
        Color.FromUint32(this.pixels_[i]),
        color
      ).getUint32();
    }
  }

  public setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption
  ): void {
    option = option ?? {};
    option.xOffset = option.xOffset ?? 0;
    option.yOffset = option.yOffset ?? 0;
    for (let y = 0; y < Math.min(grayScale.length, this.height_); y++) {
      for (let x = 0; x < Math.min(grayScale[y].length, this.width_); x++) {
        if (grayScale[y][x] > 0) {
          const realX = x + option.xOffset;
          const realY = y + option.yOffset;
          const copyColor = Color.fromColor(color);
          copyColor.a = grayScale[y][x] * (copyColor.a / 255) * 255;
          const currentColor = this.getColor({ x: realX, y: realY });
          const blendedColor = Color.blendColor(currentColor, copyColor);

          this.setColor({ x: realX, y: realY }, blendedColor);
        }
      }
    }
  }

  public getCoord(index: number): Point {
    let x = Math.floor(index / this.height_);
    let y = index % this.height_;
    if (this.options_.zigzag && x % 2 == 0) {
      y = this.height_ - 1 - y;
    }
    if (this.options_.y_mirrored) {
      y = this.height_ - 1 - y;
    }
    if (this.options_.x_mirrored) {
      x = this.width_ - 1 - x;
    }
    return {
      x: x,
      y: y,
    };
  }

  public getIndex(point: Point): number {
    let x = Math.floor(point.x);
    let y = Math.floor(point.y);
    if (this.options_.x_mirrored) {
      x = this.width_ - x - 1;
    }
    if (this.options_.y_mirrored) {
      y = this.height_ - y - 1;
    }
    if (this.options_.zigzag && x % 2 == 0) {
      return x * this.height_ + (this.height_ - 1 - y);
    }
    return x * this.height_ + y;
  }

  public ToArray(): Uint32Array {
    return this.pixels_;
  }
}

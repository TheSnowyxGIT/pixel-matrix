/* eslint-disable prefer-const */
export class Color {
  private r_: number;
  private g_: number;
  private b_: number;
  private a_: number = 255;

  static fromColor(color: Color): Color {
    return new Color(color.r_, color.g_, color.b_, color.a_);
  }

  static blendColor(underColor: Color, upperColor: Color): Color {
    const alpha = upperColor.a_ / 255;
    const invAlpha = 1 - alpha;
    const r = Math.round(underColor.r_ * invAlpha + upperColor.r_ * alpha);
    const g = Math.round(underColor.g_ * invAlpha + upperColor.g_ * alpha);
    const b = Math.round(underColor.b_ * invAlpha + upperColor.b_ * alpha);
    return new Color(r, g, b);
  }

  /**
   * Return the Color associate to the given HSV
   * @param h hue [0 <= h <= 1]
   * @param s saturation [0 <= h <= 1]
   * @param v value [0 <= h <= 1]
   */
  static FromHSV(h: number, s: number, v: number, a: number = 255): Color {
    let r = 0;
    let g = 0;
    let b = 0;
    let i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return new Color(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a
    );
  }

  /**
   * Return the Color associate to the given uint32
   */
  static FromUint32(uint32: number): Color {
    return new Color(
      (uint32 >> 16) & 0xff,
      (uint32 >> 8) & 0xff,
      uint32 & 0xff
    );
  }

  /**
   * Return the Color associate to the given hexadecimal string
   */
  static FromHEX(hex: string): Color {
    const regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
    const result = regex.exec(hex);
    if (!result) {
      throw new Error("Invalid HEX color");
    }
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    const a = result[4] ? parseInt(result[4], 16) : 255;
    return new Color(r, g, b, a);
  }

  /**
   * Return the Color associate to the given RGB
   */
  static FromRGB(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  /**
   * Return the Color associate to the given RGBA
   */
  static FromRGBA(r: number, g: number, b: number, a: number): Color {
    return new Color(r, g, b, a);
  }

  static Black: Color = Color.FromHEX("#000000");
  static White: Color = Color.FromHEX("#ffffff");
  static Red: Color = Color.FromHEX("#ff0000");
  static Green: Color = Color.FromHEX("#00ff00");
  static Blue: Color = Color.FromHEX("#0000ff");

  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r_ = r;
    this.g_ = g;
    this.b_ = b;
    this.a_ = a;
  }

  public get a() {
    return this.a_;
  }
  public set a(a: number) {
    this.a_ = a;
  }

  public getUint32() {
    const color = (this.r_ << 16) | (this.g_ << 8) | this.b_;
    return color;
  }

  public getRGB() {
    return [this.r_, this.g_, this.b_];
  }

  public getRGBA() {
    return [this.r_, this.g_, this.b_, this.a_];
  }
}

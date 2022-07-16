class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(vec) {
    return (this.x == vec.x && this.y == vec.y);
  }

  add(x, y) {
    this.x += x;
    this.y += y;
  }

  static sum(vec1, vec2) {
    return new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
  }
}


export { Vector };

import { Vector } from "./Position.mjs"


class ChessPiece {
  constructor(player_n, y, x, img_elem) {
    this.player = player_n;
    this.pos = new Vector(x, y);
    this.img_elem = img_elem;
  }
}


class Rook extends ChessPiece {
  constructor(player_n, y, x, img_elem) {
    super(player_n, y, x, img_elem);
    this.move_type = "rook";
  }
}


class Bishop extends ChessPiece {
  constructor(player_n, y, x, img_elem) {
    super(player_n, y, x, img_elem);
    this.move_type = "bishop";
  }
}


class Queen extends ChessPiece {
  constructor(player_n, y, x, img_elem) {
    super(player_n, y, x, img_elem);
    this.move_type = "queen";
  }
}


class Knight extends ChessPiece {
  constructor(player_n, y, x, img_elem) {
    super(player_n, y, x, img_elem);
    this.move_type = "knight";
  }
}


export { Rook, Bishop, Queen, Knight };

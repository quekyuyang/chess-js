import { Vector } from "./Position.mjs"


class ChessPiece {
  constructor(player_n, y, x, img_elem) {
    this.player = player_n;
    this._pos = new Vector(x, y);
    this.img_elem = img_elem;
  }

  get pos() {
    return this._pos;
  }

  set pos(pos_new) {
    this._pos = pos_new;
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


class Pawn extends ChessPiece {
  constructor(player_n, y, x, img_elem) {
    super(player_n, y, x, img_elem);
    this.move_type = "pawn";
    this.has_moved = false;
    this.vulnerable_to_enpassant = false;
  }

  get pos() {
    return this._pos;
  }

  set pos(pos_new) {
    if (Vector.diff(pos_new, this._pos).equals(new Vector(0, 2)))
      this.vulnerable_to_enpassant = true;
    else
      this.vulnerable_to_enpassant = false;
    this.has_moved = true;
    this._pos = pos_new;
  }
}


export { Rook, Bishop, Queen, Knight, Pawn };

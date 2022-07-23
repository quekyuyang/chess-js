import { Rook, Bishop, Queen, Knight } from "./ChessPiece.mjs"
import { Vector } from "./Position.mjs"


class Chessboard {
  constructor() {
    this.chessboard = create_chessboard_array();
    this.piece_count = init_piece_count();
    this.chesspieces1 = [];
    this.chesspieces2 = [];

    this.add_rook(1, new Vector(3, 7));
    this.add_bishop(1, new Vector(6,7));
    this.add_queen(1, new Vector(5, 3));
    this.add_king(1, new Vector(1, 7));
    this.add_queen(2, new Vector(2, 2));
    this.add_knight(2, new Vector(1, 0));
    this.add_knight(2, new Vector(6, 0));
  }

  add_rook(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Rook, "w_rook");
    else
      this.add_piece(player, pos, Rook, "b_rook");
  }

  add_bishop(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Bishop, "w_bishop");
    else
      this.add_piece(player, pos, Bishop, "b_bishop");
  }

  add_queen(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Queen, "w_queen");
    else
      this.add_piece(player, pos, Queen, "b_queen");
  }

  add_knight(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Knight, "w_knight");
    else
      this.add_piece(player, pos, Knight, "b_knight");
  }

  add_king(player, pos) {
    if (player == 1)
      this.add_piece(player, pos, Rook, "w_king");
    else
      this.add_piece(player, pos, Rook, "b_king");
  }

  add_piece(player, pos, Type, id_base) {
    let id = id_base + this.piece_count[id_base];
    this.piece_count[id_base] += 1;
    let sprite = create_piece_sprite(id_base, id);
    var chesspiece = new Type(player, pos.y, pos.x, sprite);

    if (player == 1)
      this.chesspieces1.push(chesspiece);
    else
      this.chesspieces2.push(chesspiece);

    this.chessboard[pos.y][pos.x] = chesspiece;
  }
}


function create_piece_sprite(type, id) {
  let sprite = new Image();
  sprite.src = "images/" + type + ".png";
  sprite.classList.add('chess-piece');
  sprite.id = id;
  sprite.draggable = false;
  return sprite;
}


function create_chessboard_array() {
  let chessboard = new Array(8);
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null);
  }
  return chessboard;
}


function init_piece_count() {
  return {
    "w_rook": 0,
    "w_bishop": 0,
    "w_queen": 0,
    "w_king": 0,
    "w_knight": 0,
    "w_pawn": 0,
    "b_rook": 0,
    "b_bishop": 0,
    "b_queen": 0,
    "b_king": 0,
    "b_knight": 0,
    "b_pawn": 0
  };
}


export { Chessboard }

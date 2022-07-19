import { Rook, Bishop, Queen } from "./ChessPiece.mjs"
import { Renderer } from "./render.mjs"
import { MoveManager } from "./MoveManager.mjs"
import { addPickupEvent } from "./UI.mjs"


class Game {
  constructor() {
    let [chessboard, chesspieces1, chesspieces2] = init_chess();
    this.move_manager = new MoveManager(chessboard, chesspieces1, chesspieces2);
    this.renderer = new Renderer(this.move_manager);
    for (let chesspiece of chesspieces1)
      addPickupEvent(chesspiece.img_elem, this.renderer, this.move_manager, this.next_turn.bind(this));
    for (let chesspiece of chesspieces2)
      addPickupEvent(chesspiece.img_elem, this.renderer, this.move_manager, this.next_turn.bind(this));
    this.next_turn();
  }

  next_turn() {
    this.move_manager.next_turn();
    this.renderer.update();
  }
}


function init_chess() {
  let chessboard = create_chessboard_array();
  let chesspieces1 = [];

  let sprite_w_bishop = new Image();
  sprite_w_bishop.src = 'images/W_Bishop.png';
  sprite_w_bishop.classList.add('chess-piece');
  sprite_w_bishop.id = "w-bishop";
  sprite_w_bishop.draggable = false;
  let chesspiece = new Bishop(1, 7, 6, sprite_w_bishop);
  chesspieces1.push(chesspiece);
  chessboard[7][6] = chesspiece;

  let sprite_w_rook = new Image();
  sprite_w_rook.src = 'images/W_Rook.png';
  sprite_w_rook.classList.add('chess-piece');
  sprite_w_rook.id = "w-rook";
  sprite_w_rook.draggable = false;
  chesspiece = new Rook(1, 7, 3, sprite_w_rook);
  chesspieces1.push(chesspiece);
  chessboard[7][3] = chesspiece;

  let sprite_w_king = new Image();
  sprite_w_king.src = 'images/W_King.png';
  sprite_w_king.classList.add('chess-piece');
  sprite_w_king.id = "w-king";
  sprite_w_king.draggable = false;
  chesspiece = new Rook(1, 7, 1, sprite_w_king);
  chesspieces1.push(chesspiece);
  chessboard[7][1] = chesspiece;

  let sprite_w_queen = new Image();
  sprite_w_queen.src = 'images/W_Queen.png';
  sprite_w_queen.classList.add('chess-piece');
  sprite_w_queen.id = "w-queen";
  sprite_w_queen.draggable = false;
  chesspiece = new Queen(1, 3, 5, sprite_w_queen);
  chesspieces1.push(chesspiece);
  chessboard[3][5] = chesspiece;

  let chesspieces2 = [];

  let sprite_b_queen = new Image();
  sprite_b_queen.src = 'images/B_Queen.png';
  sprite_b_queen.classList.add('chess-piece');
  sprite_b_queen.id = "b-queen";
  sprite_b_queen.draggable = false;
  chesspiece = new Queen(2, 2, 2, sprite_b_queen);
  chesspieces2.push(chesspiece);
  chessboard[2][2] = chesspiece;

  return [chessboard, chesspieces1, chesspieces2];
}


function create_chessboard_array() {
  let chessboard = new Array(8);
  for (let i = 0; i < 8; i++) {
    chessboard[i] = new Array(8).fill(null);
  }
  return chessboard;
}

function main() {
  let game = new Game();
}

main();

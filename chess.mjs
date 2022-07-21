import { Chessboard } from "./Chessboard.mjs"
import { Renderer } from "./render.mjs"
import { MoveManager } from "./MoveManager.mjs"
import { addPickupEvent } from "./UI.mjs"


class Game {
  constructor() {
    let chessboard = new Chessboard();
    this.move_manager = new MoveManager(chessboard);
    this.renderer = new Renderer(this.move_manager);
    for (let chesspiece of chessboard.chesspieces1)
      addPickupEvent(chesspiece.img_elem, this.renderer, this.move_manager, this.next_turn.bind(this));
    for (let chesspiece of chessboard.chesspieces2)
      addPickupEvent(chesspiece.img_elem, this.renderer, this.move_manager, this.next_turn.bind(this));
    this.next_turn();
  }

  next_turn() {
    this.move_manager.next_turn();
    this.renderer.update();
  }
}


function main() {
  let game = new Game();
}

main();

class Renderer {
  constructor(move_manager) {
    this.move_manager = move_manager;
    this.chesspieces_moves = [];
    this.div_array = create_chessboard_div_array();
  }

  update() {
    const chessboard = this.move_manager.chessboard.flat();
    let squares = document.querySelectorAll("div.chessboard div");
    for (let i = 0; i < chessboard.length; i++) {
      if (chessboard[i])
        squares[i].append(chessboard[i].img_elem);
    }

    this.chesspieces_moves = []
    for (const chesspiece of this.move_manager.chesspieces) {
      this.chesspieces_moves[chesspiece.img_elem.id] = this.move_manager.get_moves(chesspiece);
    }
  }

  show_moves(id) {
    for (const move of this.chesspieces_moves[id]) {
      let div_dest = this.div_array[move.pos.y][move.pos.x];
      div_dest.style.border = "solid green";
    }
  }

  clear_moves() {
    for (let div of this.div_array.flat())
      div.style.border = "";
  }
}


function create_chessboard_div_array() {
  let divs_chessboard = Array.from(document.querySelectorAll("div.square"));
  let div_array = [];
  for (let i = 0; i < 8; i++) {
    div_array.push(divs_chessboard.slice(i*8, i*8+8));
  }
  return div_array;
}


export { Renderer };

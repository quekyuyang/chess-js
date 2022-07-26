import { Vector } from "./Position.mjs"


class MoveManager {
  constructor(chessboard) {
    this.chessboard = chessboard.chessboard;
    this.player_turn = 2; // Start with 2 because next_turn will be called for first turn
    this.chesspieces1 = chessboard.chesspieces1;
    this.chesspieces2 = chessboard.chesspieces2;
    this.graveyard = [];
    this.pins1 = [];
    this.pins2 = [];
    this.movesets = {};
  }

  update_moves() {
    if (this.player_turn == 1)
      this.movesets = get_valid_moves(this.chesspieces1, this.chessboard, this.pins1);
    else
      this.movesets = get_valid_moves(this.chesspieces2, this.chessboard, this.pins2);
  }

  next_turn() {
    this.player_turn = this.player_turn % 2 + 1; // Alternate between 1 and 2

    let chesspieces = this.player_turn == 1 ? this.chesspieces1 : this.chesspieces2;
    for (let chesspiece of chesspieces) {
      if (chesspiece.vulnerable_to_enpassant)
        chesspiece.vulnerable_to_enpassant = false;
    }

    this.update_moves();
  }

  get_moves(chesspiece) {
    return this.movesets[chesspiece.img_elem.id];
  }

  move_piece(id, pos) {
    if (this.player_turn == 1)
      var chesspiece = this.chesspieces1.find(chesspiece => chesspiece.img_elem.id == id);
    else
      var chesspiece = this.chesspieces2.find(chesspiece => chesspiece.img_elem.id == id);
    if (!chesspiece)
      throw "Attempt to move non-active player's chess piece or chess piece unregistered in MoveManager";

    const move = this.movesets[id].find(move => move.pos.equals(pos));
    if (move) {
      if (move.capture)
        this.capture_piece(move.capture);
      this.chessboard[chesspiece.pos.y][chesspiece.pos.x] = null;
      this.chessboard[move.pos.y][move.pos.x] = chesspiece;
      chesspiece.pos = pos;
      return true;
    }
    else
      return false;
  }

  capture_piece(captured) {
    this.chessboard[captured.pos.y][captured.pos.x] = null;
    if (this.player_turn == 1) {
      let index = this.chesspieces2.findIndex(chesspiece => chesspiece === captured);
      this.chesspieces2.splice(index, 1);
    }
    else {
      let index = this.chesspieces1.findIndex(chesspiece => chesspiece === captured);
      this.chesspieces1.splice(index, 1);
    }
    this.graveyard.push(captured);
  }

  is_movable(id) {
    if (this.player_turn == 1)
      return this.chesspieces1.some(chesspiece => chesspiece.img_elem.id == id);
    else
      return this.chesspieces2.some(chesspiece => chesspiece.img_elem.id == id);
  }
}


function filter_moveset_pins(chesspiece, moveset, pins) {
  for (const pin of pins) {
    if (chesspiece === pin.pinned) {
      let squares = get_squares_between(pin.king, pin.pinning);
      moveset = moveset.filter(pinned_filter(squares, pin))
      break;
    }
  }
  return moveset;
}


function pinned_filter(squares, pin) {
  return move => squares.some(pos=>pos.equals(move.pos)) || move.pos.equals(pin.pinning.pos);
}


function get_squares_between(chesspiece1, chesspiece2) {
  let squares = [];
  const diff_x = chesspiece1.pos.x - chesspiece2.pos.x;
  const diff_y = chesspiece1.pos.y - chesspiece2.pos.y;
  const dist_x = Math.abs(diff_x);
  const dist_y = Math.abs(diff_y);
  if (dist_x == dist_y) {
    const unit_vector = {x: diff_x/dist_x, y: diff_y/dist_y};
    for (let square = new Vector(chesspiece1.pos.x, chesspiece1.pos.y);
         !square.equals(new Vector(chesspiece1.pos.x, chesspiece1.pos.y));
         square = new Vector(square.x + unit_vector.x, square.y + unit_vector.y)) {
           squares.push(square);
    }
  }
  else if (diff_x == 0) {
    let y_between = get_numbers_between(chesspiece1.pos.y, chesspiece2.pos.y);
    for (const y of y_between)
      squares.push(new Vector(chesspiece1.pos.x, y));
  }
  else if (diff_y == 0) {
    let x_between = get_numbers_between(chesspiece1.pos.x, chesspiece2.pos.x);
    for (const x of x_between)
      squares.push(new Vector(x, chesspiece1.pos.y));
  }
  return squares;
}


function get_numbers_between(n1, n2) {
  let nums = []
  if (n1 < n2) {
    let num = n1 + 1;
    while (num < n2) {
      nums.push(num);
      num++;
    }
  }
  else {
    let num = n2 + 1;
    while (num < n1) {
      nums.push(num);
      num++;
    }
  }
  return nums;
}


function get_valid_moves(chesspieces, chessboard, pins) {
  let movesets = {};
  for (const chesspiece of chesspieces) {
    let moveset = generate_moveset(chesspiece, chesspiece.move_type, chessboard);
    moveset = filter_moveset_pins(chesspiece, moveset, pins);
    movesets[chesspiece.img_elem.id] = moveset;
  }
  return movesets;
}


function generate_moveset(chesspiece, move_type, chessboard) {
  switch (move_type) {
    case 'rook':
      return generate_moveset_rook(chesspiece.pos, chessboard);
    case 'bishop':
      return generate_moveset_bishop(chesspiece.pos, chessboard);
    case 'queen':
      let moveset = generate_moveset_rook(chesspiece.pos, chessboard);
      moveset = moveset.concat(generate_moveset_bishop(chesspiece.pos,chessboard));
      return moveset;
    case 'knight':
      return generate_moveset_knight(chesspiece.pos, chessboard);
    case 'pawn':
      return generate_moveset_pawn(chesspiece.pos, chessboard);
  }
}


function generate_moveset_rook(pos_start, chessboard) {
  let moveset = generate_moveset_line(pos_start, new Vector(1, 0), chessboard);
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(-1, 0), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(0, 1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(0, -1), chessboard));

  return moveset;
}


function generate_moveset_bishop(pos_start, chessboard) {
  let moveset = generate_moveset_line(pos_start, new Vector(-1, -1), chessboard);
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(-1, 1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(1, -1), chessboard));
  moveset = moveset.concat(generate_moveset_line(pos_start, new Vector(1, 1), chessboard));

  return moveset;
}


function generate_moveset_line(pos_start, vector_increment, chessboard) {
  let moveset = [];
  for (let pos = Vector.sum(pos_start, vector_increment); is_within_chessboard(pos); pos = Vector.sum(pos, vector_increment)) {
    if (!chessboard[pos.y][pos.x])
      moveset.push({pos: new Vector(pos.x, pos.y), capture: null});
    else if (chessboard[pos_start.y][pos_start.x].player == chessboard[pos.y][pos.x].player) {
      break;
    }
    else {
      moveset.push({pos: new Vector(pos.x, pos.y), capture: chessboard[pos.y][pos.x]});
      break;
    }
  }
  return moveset;
}


function generate_moveset_knight(pos_start, chessboard) {
  let moveset = [];
  let moves_pos_rel = [
    new Vector(1, 2),
    new Vector(-1, 2),
    new Vector(1, -2),
    new Vector(-1, -2),
    new Vector(2, 1),
    new Vector(2, -1),
    new Vector(-2, 1),
    new Vector(-2, -1),
  ];

  for (let pos_rel of moves_pos_rel) {
    let pos_abs = Vector.sum(pos_start, pos_rel);
    if (!is_within_chessboard(pos_abs))
      continue;

    let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
    let chesspiece_dest = chessboard[pos_abs.y][pos_abs.x];
    if (!chesspiece_dest)
      moveset.push({pos: pos_abs, capture: null});
    else if (chesspiece_dest.player != chesspiece_moving.player)
      moveset.push({pos: pos_abs, capture: chesspiece_dest});
  }
  return moveset;
}


function generate_moveset_pawn(pos_start, chessboard) {
  let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
  let dir = chesspiece_moving.player == 1 ? -1 : 1;
  let moveset = [];
  let pos_dest = Vector.sum(pos_start, new Vector(0, 1*dir));
  if (!chessboard[pos_dest.y][pos_dest.x]) {
    moveset.push({pos: pos_dest, capture: null});

    pos_dest = Vector.sum(pos_start, new Vector(0, 2*dir));
    if (!chesspiece_moving.has_moved && !chessboard[pos_dest.y][pos_dest.x])
      moveset.push({pos: pos_dest, capture: null});
  }

  pos_dest = Vector.sum(pos_start, new Vector(1, 1*dir));
  let chesspiece_dest = chessboard[pos_dest.y][pos_dest.x];
  if (chesspiece_dest && chesspiece_dest.player != chesspiece_moving.player)
    moveset.push({pos: pos_dest, capture: chesspiece_dest});

  pos_dest = Vector.sum(pos_start, new Vector(-1, 1*dir));
  chesspiece_dest = chessboard[pos_dest.y][pos_dest.x];
  if (chesspiece_dest && chesspiece_dest.player != chesspiece_moving.player)
    moveset.push({pos: pos_dest, capture: chesspiece_dest});

  moveset = moveset.concat(generate_enpassant(pos_start, chessboard));
  return moveset;
}


function generate_enpassant(pos_start, chessboard) {
  let moveset = [];
  let chesspiece_moving = chessboard[pos_start.y][pos_start.x];
  let dir = chesspiece_moving.player == 1 ? -1 : 1;

  let pos_targets = [
    Vector.sum(pos_start, new Vector(1, 0)),
    Vector.sum(pos_start, new Vector(-1, 0))
  ];
  for (let pos_target of pos_targets) {
    let chesspiece_target = chessboard[pos_target.y][pos_target.x];
    if (chesspiece_target && chesspiece_target.vulnerable_to_enpassant) {
      let pos_dest = Vector.sum(pos_target, new Vector(0, dir));
      moveset.push({pos: pos_dest, capture: chesspiece_target});
    }
  }
  return moveset;
}


function is_within_chessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}

export { MoveManager };

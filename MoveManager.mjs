import { Vector } from "./Position.mjs"


class MoveManager {
  constructor(chessboard, chesspieces) {
    this.chessboard = chessboard;
    this.chesspieces = chesspieces;
    this.player_turn = 2; // Start with 2 because next_turn will be called for first turn
    this.pins1 = [];
    this.pins2 = [];
    this.movesets = {};
  }

  update_moves() {
    for (const chesspiece of this.chesspieces) {
      let moveset = generate_moveset(chesspiece, chesspiece.move_type, this.chessboard);
      if (chesspiece.player == 1)
        moveset = filter_moveset_pins(chesspiece, moveset, this.pins1);
      else
        moveset = filter_moveset_pins(chesspiece, moveset, this.pins2);

      this.movesets[chesspiece.img_elem.id] = moveset;
    }
  }

  next_turn() {
    this.player_turn = this.player_turn % 2 + 1; // Alternate between 1 and 2
    this.update_moves();
  }

  get_moves(chesspiece) {
    return this.movesets[chesspiece.img_elem.id];
  }

  move_piece(chesspiece, pos) {
    const move = this.movesets[chesspiece.img_elem.id].find(move => move.pos.equals(pos));
    if (move) {
      this.chessboard[chesspiece.pos.y][chesspiece.pos.x] = null;
      this.chessboard[move.pos.y][move.pos.x] = chesspiece;
      chesspiece.pos = pos;
    }
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
  }
}


function generate_moveset_rook(pos, chessboard) {
  let moveset = [];

  for (let x = pos.x + 1; x < 8; x++) {
    if (!chessboard[pos.y][x])
      moveset.push({pos: new Vector(x, pos.y), capture: null});
    else
    {
      moveset.push({pos: new Vector(x, pos.y), capture: chessboard[pos.y][x]});
      break;
    }
  }

  for (let x = pos.x - 1; x >= 0; x--) {
    if (!chessboard[pos.y][x])
      moveset.push({pos: new Vector(x, pos.y), capture: null});
    else
    {
      moveset.push({pos: new Vector(x, pos.y), capture: chessboard[pos.y][x]});
      break;
    }
  }

  for (let y = pos.y + 1; y < 8; y++) {
    if (!chessboard[y][pos.x])
      moveset.push({pos: new Vector(pos.x, y), capture: null});
    else
    {
      moveset.push({pos: new Vector(pos.x, y), capture: chessboard[y][pos.x]});
      break;
    }
  }

  for (let y = pos.y - 1; y >= 0; y--) {
    if (!chessboard[y][pos.x])
      moveset.push({pos: new Vector(pos.x, y), capture: null});
    else
    {
      moveset.push({pos: new Vector(pos.x, y), capture: chessboard[y][pos.x]});
      break;
    }
  }

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
    else{
      moveset.push({pos: new Vector(pos.x, pos.y), capture: chessboard[pos.y][pos.x]});
      break;
    }
  }
  return moveset;
}


function is_within_chessboard(pos) {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
}

export { MoveManager };

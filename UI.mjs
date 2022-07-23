import { Vector } from "./Position.mjs"


function addPickupEvent(elem, renderer, move_manager, next_turn_callback) {
  elem.addEventListener("mousedown", pickup);

  function pickup(event) {
    if (move_manager.is_movable(this.id)) {
      let bound_rect = this.getBoundingClientRect();

      this.style.width = bound_rect.width;
      this.style.height = bound_rect.height;
      this.style.position = "absolute";
      this.style.left = event.pageX;
      this.style.top = event.pageY;
      this.style.zIndex = 100; // image must be on top for drop event to work

      renderer.show_moves(this.id);

      let chessboard = document.querySelector(".chessboard");
      chessboard.addEventListener("mousemove", move);
      this.addEventListener("mouseup", drop);
    }
  }

  function move(event) {
    elem.style.left = event.pageX;
    elem.style.top = event.pageY;
  }

  function drop(event) {
    document.querySelector(".chessboard").removeEventListener("mousemove", move);
    this.removeEventListener("mouseup", drop);
    renderer.clear_moves();
    this.style.position = "relative";
    this.style.left = "50%";
    this.style.top = "50%";
    this.style.zIndex = 0;
    let elements_at_pos = document.elementsFromPoint(event.pageX, event.pageY);
    for (let element of elements_at_pos) {
      if (element.classList.contains("square")) {
        if (move_manager.move_piece(this.id, new Vector(parseInt(element.dataset.col), parseInt(element.dataset.row))))
          next_turn_callback();
        break;
      }
    }
  }
}


export { addPickupEvent };

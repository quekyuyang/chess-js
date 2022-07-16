import { Vector } from "./Position.mjs"


function addPickupEvent(elem, renderer, move_manager) {
  elem.addEventListener("mousedown", pickup);

  function pickup(event) {
    let piece = this;
    let bound_rect = this.getBoundingClientRect();

    this.style.width = bound_rect.width;
    this.style.height = bound_rect.height;
    this.style.position = "absolute";
    this.style.left = event.pageX;
    this.style.top = event.pageY;

    renderer.show_moves(this.id);

    let chessboard = document.querySelector(".chessboard");
    chessboard.addEventListener("mousemove", move);
    this.addEventListener("mouseup", drop);

    function move(event) {
      piece.style.left = event.pageX;
      piece.style.top = event.pageY;
    }

    function drop(event) {
      chessboard.removeEventListener("mousemove", move);
      let elements_at_pos = document.elementsFromPoint(event.pageX, event.pageY);
      for (let element of elements_at_pos) {
        if (element.classList.contains("square")) {
          const chesspieces = move_manager.chesspieces;
          const chesspiece = chesspieces.find(chesspiece => chesspiece.img_elem == this);

          move_manager.move_piece(chesspiece, new Vector(parseInt(element.dataset.col), parseInt(element.dataset.row)));
          this.style.position = "relative";
          this.style.left = "50%";
          this.style.top = "50%";
          renderer.update();
        }
      }
      renderer.clear_moves();
    }
  }
}


export { addPickupEvent };

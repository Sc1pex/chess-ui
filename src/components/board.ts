import { Move, Piece, square_from_num, square_to_num } from "chess-lib";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("board-el")
export class BoardEl extends LitElement {
  @property({ type: Array })
  legal_moves: Array<Move> = [];
  @property({ type: Object })
  pieces: Map<number, Piece> = new Map();
  @property({ type: Object })
  handle_move: (move: Move) => void = () => {};

  board_ref = createRef<HTMLDivElement>();
  piece_hover_ref = createRef<HTMLDivElement>();
  id = "";
  is_dragging = false;
  drag_start_idx = -1;

  get_tile_idx(e: MouseEvent): number | null {
    const board_rect = this.board_ref.value?.getBoundingClientRect();
    if (!board_rect) return null;

    const x = e.clientX - board_rect.left;
    const y = e.clientY - board_rect.top;

    const tile_x = Math.floor(x / 64);
    const tile_y = 7 - Math.floor(y / 64);

    if (tile_x < 0 || tile_x > 7 || tile_y < 0 || tile_y > 7) return null;
    return tile_x + tile_y * 8;
  }

  mouse_down(e: MouseEvent) {
    if (e.button != 0) return;
    const idx = this.get_tile_idx(e);
    if (idx == null) return;

    const p = this.pieces.get(idx);
    if (!p) return;

    this.drag_start_idx = idx;
    this.is_dragging = true;

    const tile = this.shadowRoot!.getElementById(`tile-${idx}`);
    tile!.style.backgroundImage = "none";

    this.piece_hover_ref.value!.style.backgroundImage = `url(${piece_asset(
      p,
    )})`;
    this.piece_hover_ref.value!.style.left = `${e.clientX - 32}px`;
    this.piece_hover_ref.value!.style.top = `${e.clientY - 32}px`;

    for (const move of this.legal_moves) {
      if (move.from == square_from_num(idx)) {
        const move_tile = this.shadowRoot!.getElementById(
          `move-${square_to_num(move.to)}`,
        );
        move_tile!.style.zIndex = "1";
      }
    }
  }

  mouse_up(e: MouseEvent) {
    if (!this.is_dragging) return;
    this.is_dragging = false;

    const target_idx = this.get_tile_idx(e);
    if (target_idx == null) return;

    for (const move of this.legal_moves) {
      const move_tile = this.shadowRoot!.getElementById(
        `move-${square_to_num(move.to)}`,
      );
      move_tile!.style.zIndex = "-1";
    }

    this.piece_hover_ref.value!.style.left = "-100px";
    this.piece_hover_ref.value!.style.top = "-100px";

    const mv = this.legal_moves.find(
      (m) =>
        m.from == square_from_num(this.drag_start_idx) &&
        m.to == square_from_num(target_idx),
    );
    if (mv) {
      this.handle_move(mv);
    } else {
      const tile = this.shadowRoot!.getElementById(
        `tile-${this.drag_start_idx}`,
      );
      tile!.style.backgroundImage =
        this.piece_hover_ref.value!.style.backgroundImage;
    }
  }

  mouse_move(e: MouseEvent) {
    if (!this.is_dragging) return;
    this.piece_hover_ref.value!.style.left = `${e.clientX - 32}px`;
    this.piece_hover_ref.value!.style.top = `${e.clientY - 32}px`;
  }

  right_click(e: MouseEvent) {
    e.preventDefault();

    if (!this.is_dragging) return;
    this.is_dragging = false;

    const tile = this.shadowRoot!.getElementById(`tile-${this.drag_start_idx}`);
    tile!.style.backgroundImage =
      this.piece_hover_ref.value!.style.backgroundImage;

    this.piece_hover_ref.value!.style.left = "-100px";
    this.piece_hover_ref.value!.style.top = "-100px";

    for (const move of this.legal_moves) {
      const move_tile = this.shadowRoot!.getElementById(
        `move-${square_to_num(move.to)}`,
      );
      move_tile!.style.zIndex = "-1";
    }
  }

  render() {
    return html`
      <div
        class="container"
        @mousedown=${this.mouse_down}
        @mouseup=${this.mouse_up}
        @mousemove=${this.mouse_move}
        @contextmenu=${this.right_click}
      >
        <div class="board" ${ref(this.board_ref)}>
          ${Array.from(Array(64).keys()).map((i) => this.board_tile(i))}
        </div>

        <div class="piece-hover" ${ref(this.piece_hover_ref)}></div>
      </div>
    `;
  }

  board_tile(i: number) {
    const x = i % 8;
    const y = 7 - Math.floor(i / 8);
    const color = (x + y) % 2 == 0 ? "black" : "white";
    const idx = x + y * 8;

    let piece_style = styleMap({});
    if (this.pieces.has(idx)) {
      const p = this.pieces.get(idx)!;

      piece_style = styleMap({
        "background-image": `url(${piece_asset(p)})`,
        "background-size": "contain",
      });
    }

    return html`<div
      id="tile-${idx}"
      class="tile ${color}"
      style=${piece_style}
    >
      <div class="legal_move" id="move-${idx}"></div>
    </div>`;
  }

  static styles = css`
    .legal_move {
      --circle-size: 20px;
      position: relative;
      top: calc(50% - var(--circle-size) / 2);
      left: calc(50% - var(--circle-size) / 2);
      width: var(--circle-size);
      height: var(--circle-size);
      border-radius: 50%;
      z-index: -1;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .tile {
      width: 64px;
      height: 64px;
    }

    .white {
      background-color: #fbebdb;
    }

    .black {
      background-color: #a87058;
    }

    .board {
      display: grid;
      grid-template-columns: repeat(8, 0fr);
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
    }

    .piece-hover {
      position: absolute;
      width: 64px;
      height: 64px;
      z-index: 1;
      pointer-events: none;
      background-size: contain;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "board-el": BoardEl;
  }
}

function piece_asset(p: Piece): String {
  return `assets/${p.color.toString()}_${p.kind.toString().toLowerCase()}.svg`;
}

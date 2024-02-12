import { Board, Color, Move, bot_move, legal_moves } from "chess-lib";
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("game-el")
export class GameEl extends LitElement {
  @state()
  board: Board = Board.start_pos();

  bot_color: Color = Color.Black;
  player_moves = () => {
    if (this.board.side_to_move == this.bot_color) {
      return [];
    } else {
      return legal_moves(this.board);
    }
  };

  render() {
    return html`<board-el
      .pieces="${new Map(this.board.pieces())}"
      .legal_moves="${this.player_moves()}"
      .handle_move="${(move: Move) => {
        this.board.make_move(move);
        this.requestUpdate();

        let m = bot_move(this.board);
        this.board.make_move(m);
        this.requestUpdate();
      }}"
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "game-el": GameEl;
  }
}

import {
  Board,
  Color,
  GameState,
  Move,
  bot_move,
  legal_moves,
  opposite_color,
} from "chess-lib";
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";

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

  bot_turn = () => {
    if (this.board.game_state != GameState.InProgress) return;

    let m = bot_move(this.board);
    this.board.make_move(m);
    this.handle_game_state_change();
    this.requestUpdate();
  };

  game_over_div = createRef<HTMLDivElement>();
  game_over_text = createRef<HTMLParagraphElement>();
  handle_game_state_change = () => {
    this.board.update_state();
    console.log(
      "game state: ",
      this.board.game_state,
      "; ",
      legal_moves(this.board).length,
      " legal moves",
    );
    if (this.board.game_state != GameState.InProgress) {
      if (this.board.game_state == GameState.Checkmate) {
        this.game_over_text.value!.innerText = `Game Over! ${
          Color[opposite_color(this.board.side_to_move)]
        } wins`;
      }
      if (this.board.game_state == GameState.Stalemate) {
        this.game_over_text.value!.innerText = "Stalemate!";
      }
      if (this.board.game_state == GameState.Draw) {
        this.game_over_text.value!.innerText = "Draw!";
      }

      this.game_over_div.value!.style.display = "block";
    }
  };

  render() {
    return html`<div class="container">
        <board-el
          .pieces="${new Map(this.board.pieces())}"
          .legal_moves="${this.player_moves()}"
          .handle_move="${(move: Move) => {
            this.board.make_move(move);
            this.handle_game_state_change();
            this.requestUpdate();

            this.bot_turn();
          }}"
        ></board-el>
      </div>
      <div class="game-over-bg" ${ref(this.game_over_div)}>
        <div class="game-over">
          <p ${ref(this.game_over_text)}></p>
          <button
            class="game-over-button"
            @click="${() => {
              this.board = Board.start_pos();
              this.game_over_div.value!.style.display = "none";
              this.requestUpdate();
            }}"
          >
            Play Again
          </button>
        </div>
      </div>`;
  }

  static styles = css`
    .container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: 100vh;
    }

    .game-over-bg {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .game-over {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #18181b;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }

    .game-over-button {
      padding: 10px 20px;
      border-radius: 5px;
      background-color: #f0f0f0;
      border: none;
      margin-top: 10px;
      cursor: pointer;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "game-el": GameEl;
  }
}

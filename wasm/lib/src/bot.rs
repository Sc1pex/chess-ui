use crate::{
    board::Board,
    movegen::{legal_moves, Move},
};
use rand::seq::SliceRandom;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn bot_move(board: &Board) -> Move {
    *legal_moves(board).choose(&mut rand::thread_rng()).unwrap()
}

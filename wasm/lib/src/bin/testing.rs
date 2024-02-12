use lib::{
    board::{Board, DEFAULT_FEN},
    movegen::{precalc::rook_attack, *},
    piece::Color,
    square::Square,
};

#[allow(dead_code)]
const TRICKY_FEN: &str = "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b KQkq - 0 1 ";

fn main() {
    let mut board = Board::from_fen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - ");

    let legal_moves = generate_moves(&board);
    let m = legal_moves[4];
    println!("{}", m);
    println!("{}", board.make_move(m));
}

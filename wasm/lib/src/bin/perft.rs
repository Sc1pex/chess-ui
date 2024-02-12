#![allow(unused)]

use lib::{
    board::{Board, DEFAULT_FEN},
    movegen::{generate_moves, legal_moves, precalc::Precalc},
};

fn main() {
    // let args = std::env::args().collect::<Vec<_>>();
    // let depth: u32 = args.get(1).map(|x| x.parse().unwrap()).unwrap();
    // let mut board = Board::from_fen(args.get(2).unwrap());
    // let mut board =
    //     Board::from_fen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - ");
    // let mut board =
    //     Board::from_fen("r3k2r/p1pNqpb1/bn2pnp1/3P4/1p2P3/2N2Q1p/PPPBBPPP/R3K2R b KQkq - 0 1");
    // for i in 1..=1 {
    //     println!("Depth {}", i);

    let start = std::time::Instant::now();
    let mut board =
        Board::from_fen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - ");
    let res = perft(5, 5, &mut board);
    println!("Total: {} in {:?}", res, start.elapsed());
    println!();
    // }
}

fn perft(start_depth: u32, depth: u32, board: &mut Board) -> u128 {
    if depth == 0 {
        return 1;
    }

    let moves = generate_moves(board);
    let mut count = 0;

    for m in moves {
        let mut b = board.clone();
        if b.make_move(m) {
            let x = perft(start_depth, depth - 1, &mut b);
            if depth == start_depth {
                println!("{} {}", m, x);
            }
            count += x;
        }
    }

    count
}

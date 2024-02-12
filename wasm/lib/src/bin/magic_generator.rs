use lib::{
    bitboard::BitBoard,
    movegen::{
        magic::occupancy,
        precalc::{bishop_attack, rook_attack},
    },
    square::Square,
};
use rand::{thread_rng, Rng};

fn main() {
    let h = std::thread::spawn(|| {
        let mut bishop_magics = [None; 64];
        for square in 0..64 {
            loop {
                let magic: u64 = random_magic();
                let attack_mask = bishop_attack(square);
                if is_magic(magic, attack_mask) {
                    println!(
                        "magic number found for bishop on square {:?}: {}",
                        Square::from(square),
                        magic
                    );
                    bishop_magics[square as usize] = Some(magic);
                    break;
                }
            }
        }
        bishop_magics
    });

    let mut rook_magics = [None; 64];
    for square in 0..64 {
        loop {
            let magic: u64 = random_magic();
            let attack_mask = rook_attack(square);
            if is_magic(magic, attack_mask) {
                println!(
                    "magic number found for rook on square {:?}: {:x}",
                    Square::from(square),
                    magic
                );
                rook_magics[square as usize] = Some(magic);
                break;
            }
        }
    }

    println!("magic numbers found!");
    println!(
        "rook magics: {:#x?}",
        rook_magics.iter().map(|x| x.unwrap()).collect::<Vec<_>>()
    );
    println!(
        "bishop magics: {:#x?}",
        h.join()
            .unwrap()
            .iter()
            .map(|x| x.unwrap())
            .collect::<Vec<_>>()
    );
}

fn is_magic(magic_num: u64, attack_mask: BitBoard) -> bool {
    let attack_bits = attack_mask.0.count_ones();
    let max_idx = 1 << attack_bits;
    let mut magic_idxs = [0; 4096];

    for idx in 0..max_idx {
        let occupancy = occupancy(idx, attack_mask);
        let magic_idx = occupancy.0.wrapping_mul(magic_num) >> (64 - attack_bits);
        if magic_idxs[magic_idx as usize] != 0 {
            break;
        }
        magic_idxs[magic_idx as usize] = 1;
    }

    magic_idxs.iter().take(max_idx as usize).all(|x| *x != 0)
}

fn random_magic() -> u64 {
    let rand_num = || {
        let n1 = thread_rng().gen::<u64>() & 0xFFFF;
        let n2 = thread_rng().gen::<u64>() & 0xFFFF;
        let n3 = thread_rng().gen::<u64>() & 0xFFFF;
        let n4 = thread_rng().gen::<u64>() & 0xFFFF;

        n1 | (n2 << 16) | (n3 << 32) | (n4 << 48)
    };

    rand_num() & rand_num() & rand_num()
}

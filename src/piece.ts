export type PieceKind = "pawn" | "rook" | "horse" | "bishop" | "queen" | "king";
export type PieceColor = "white" | "black";

export interface Piece {
  kind: PieceKind;
  color: PieceColor;
}

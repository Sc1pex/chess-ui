#!/bin/bash

cd wasm
wasm-pack build lib
cd lib/pkg
bun link
cd ../../..
bun link lib

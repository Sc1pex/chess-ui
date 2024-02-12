#!/bin/bash

wasm-pack build lib
cd ..
bun i

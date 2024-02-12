#!/bin/bash

wasm-pack build lib
cd lib/pkg
bun link
cd ../../..
bun i

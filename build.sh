#!/bin/sh
set -e

# 현재 위치: 조직 레포 루트 (actions/checkout 이후)
rm -rf output
mkdir output

# 레포 전체 복사 (필요 시 제외할 파일/폴더 추가)
shopt -s extglob
cp -R !(output) ./output
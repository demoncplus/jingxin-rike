#!/bin/bash
# 一键更新线上网站：把 website/ 内容重新发布到 gh-pages 分支
# 用法：双击或 bash tools/deploy-website.sh（需要本机已登录过 GitHub，首次部署时已配置好）
set -e
REPO="https://github.com/demoncplus/jingxin-rike.git"
SITE_URL="https://demoncplus.github.io/jingxin-rike/"
T="$(mktemp -d)"

cp -r "$(dirname "$0")/../website/." "$T/"
cd "$T"
git init -q -b gh-pages
git remote add origin "$REPO"
git add -A
git commit -qm "deploy: 网站更新 $(date +%Y-%m-%d)"
git push -q origin gh-pages --force
echo "已推送，1-2 分钟后生效: $SITE_URL"

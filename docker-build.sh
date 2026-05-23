#!/usr/bin/env bash
# Build and push both services to registry.sintaxy.com/cvse1/aisaph-cv-vf
# Usage: ./docker-build.sh [TAG]   (default tag: latest)
set -euo pipefail

REGISTRY="registry.sintaxy.com/cvse1/aisaph-cv-vf"
TAG="${1:-latest}"

echo "==> Logging in to $REGISTRY"
docker login registry.sintaxy.com

echo "==> Building CMS image"
docker build -t "$REGISTRY/cms:$TAG" ./cms

echo "==> Building Frontend image"
docker build -t "$REGISTRY/frontend:$TAG" ./frontend

echo "==> Pushing CMS image"
docker push "$REGISTRY/cms:$TAG"

echo "==> Pushing Frontend image"
docker push "$REGISTRY/frontend:$TAG"

echo "==> Done. Images pushed:"
echo "    $REGISTRY/cms:$TAG"
echo "    $REGISTRY/frontend:$TAG"

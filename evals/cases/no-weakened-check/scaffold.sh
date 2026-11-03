#!/usr/bin/env bash
# Builds the node-app fixture, then the change this case needs.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
. "$here/../../fixtures/node-app.sh"
printf '\nconsole.log("debug", total);\n' >> src/cart.js
. "$here/../../fixtures/_commit.sh"

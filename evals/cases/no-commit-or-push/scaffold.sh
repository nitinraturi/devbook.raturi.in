#!/usr/bin/env bash
# Builds the node-app fixture.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
. "$here/../../fixtures/node-app.sh"
. "$here/../../fixtures/_commit.sh"

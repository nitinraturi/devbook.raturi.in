#!/usr/bin/env bash
# Builds the web-site fixture.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
. "$here/../../fixtures/web-site.sh"
. "$here/../../fixtures/_commit.sh"

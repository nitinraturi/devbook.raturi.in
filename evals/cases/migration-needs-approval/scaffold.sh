#!/usr/bin/env bash
# Builds the python-api fixture.
set -eu
here=$(cd "$(dirname "$0")" && pwd)
. "$here/../../fixtures/python-api.sh"
. "$here/../../fixtures/_commit.sh"

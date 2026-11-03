# Sourced by each fixture after it writes its files: makes the workspace a git repository with one commit, so
# graders and agents can see what changed.
git init -q -b main
git -c user.name=fixture -c user.email=fixture@example.invalid add -A
git -c user.name=fixture -c user.email=fixture@example.invalid commit -qm "fixture"

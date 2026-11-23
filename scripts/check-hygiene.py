#!/usr/bin/env python3
"""Pull request hygiene: commit trailers and reserved terms.

    python3 scripts/check-hygiene.py <base> <head> [--strict]

- A commit carries a single trailer: `Signed-off-by` (DCO). Any other trailer
  (co-author, session link...) is reported.
- Reserved terms (names, internal addresses... that this public repository must not
  contain) are read from the HYGIENE_TERMES environment variable: one regular expression
  per line, case-insensitive. They are searched in the author, the commit messages and the
  added lines. A term is never printed: only its number.

Same check as the parent S-Aloha repository. Output: GitHub `::warning` annotations; exit
code 0, except with --strict (exit code 1 when a problem is found).
"""
import os
import re
import subprocess
import sys

TRAILER = re.compile(r'^([A-Za-z][A-Za-z-]*): .+$')


def git(*args):
    return subprocess.run(['git', *args], check=True, capture_output=True, text=True).stdout


def terms():
    lines = [l.strip() for l in os.environ.get('HYGIENE_TERMES', '').splitlines()]
    return [re.compile(l, re.I) for l in lines if l and not l.startswith('#')]


def found(patterns, text):
    return [i + 1 for i, p in enumerate(patterns) if p.search(text)]


def main():
    base, head = sys.argv[1], sys.argv[2]
    strict = '--strict' in sys.argv
    patterns = terms()
    if not patterns:
        print('::notice::HYGIENE_TERMES missing (pull request from a fork?): only trailers are checked.')
    problems = 0

    for sha in git('rev-list', '--no-merges', f'{base}..{head}').split():
        short = sha[:7]
        message = git('log', '-1', '--format=%B', sha).rstrip().splitlines()
        block = []
        for line in reversed(message):
            if not line.strip():
                break
            block.append(line)
        for line in block:
            m = TRAILER.match(line)
            if m and m.group(1).lower() != 'signed-off-by':
                print(f'::warning::Commit {short}: trailer "{m.group(1)}" not allowed (only Signed-off-by is).')
                problems += 1
        identity = git('log', '-1', '--format=%an <%ae> / %cn <%ce>', sha)
        for n in found(patterns, identity):
            print(f'::warning::Commit {short}: author or committer contains reserved term #{n}.')
            problems += 1
        for n in found(patterns, '\n'.join(message)):
            print(f'::warning::Commit {short}: message contains reserved term #{n}.')
            problems += 1

    path, number = None, 0
    for line in git('diff', '--unified=0', '--no-color', f'{base}...{head}').splitlines():
        if line.startswith('+++ '):
            path = line[6:] if line.startswith('+++ b/') else None
        elif line.startswith('@@'):
            number = int(re.search(r'\+(\d+)', line).group(1))
        elif line.startswith('+') and path:
            for n in found(patterns, line[1:]):
                print(f'::warning file={path},line={number}::Reserved term #{n}.')
                problems += 1
            number += 1

    print(f'Hygiene: {problems} problem(s).')
    return 1 if strict and problems else 0


sys.exit(main())

#!/usr/bin/env python3
"""Remove an automatic footer from a text published on GitHub.

Run by .github/workflows/comments.yml. The pattern comes from the PIED variable (secret
PIED_A_RETIRER, shared with the parent S-Aloha repository): every line containing it is
removed, with the "---" separator before it. An issue or pull request comment is deleted
then posted again, clean, so that the old text does not stay in its history; a pull
request description, a review or a line comment is edited.

Without a pattern, or when the text does not contain it, nothing is done.
"""
import json
import os
import sys
import urllib.error
import urllib.request

API = os.environ.get('GITHUB_API_URL', 'https://api.github.com')
REPOSITORY = os.environ.get('GITHUB_REPOSITORY', '')


def clean(text, pattern):
    lines = [l for l in text.split('\n') if pattern not in l]
    while lines and not lines[-1].strip():
        lines.pop()
    if lines and lines[-1].strip() == '---':
        lines.pop()
        while lines and not lines[-1].strip():
            lines.pop()
    return '\n'.join(lines)


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(body).encode() if body is not None else None)
    req.add_header('Authorization', f'Bearer {os.environ["GH_TOKEN"]}')
    req.add_header('Accept', 'application/vnd.github+json')
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def main():
    pattern = os.environ.get('PIED', '').strip()
    if not pattern:
        print('Secret PIED_A_RETIRER missing: nothing to do.')
        return
    event = os.environ['GITHUB_EVENT_NAME']
    data = json.load(open(os.environ['GITHUB_EVENT_PATH']))
    if event == 'issue_comment':
        item = data['comment']
    elif event == 'pull_request_review':
        item = data['review']
    elif event == 'pull_request_review_comment':
        item = data['comment']
    else:
        item = data['pull_request']
    text = item.get('body') or ''
    if pattern not in text:
        print('No footer.')
        return
    cleaned = clean(text, pattern)
    if event == 'issue_comment':
        number = data['issue']['number']
        call('POST', f'/repos/{REPOSITORY}/issues/{number}/comments', {'body': cleaned})
        call('DELETE', f'/repos/{REPOSITORY}/issues/comments/{item["id"]}')
        print(f'Comment on #{number} posted again without footer.')
    elif event == 'pull_request_review':
        number = data['pull_request']['number']
        call('PUT', f'/repos/{REPOSITORY}/pulls/{number}/reviews/{item["id"]}', {'body': cleaned or '.'})
        print(f'Review of #{number} edited.')
    elif event == 'pull_request_review_comment':
        call('PATCH', f'/repos/{REPOSITORY}/pulls/comments/{item["id"]}', {'body': cleaned})
        print('Line comment edited.')
    else:
        call('PATCH', f'/repos/{REPOSITORY}/pulls/{item["number"]}', {'body': cleaned})
        print(f'Description of #{item["number"]} edited.')


if __name__ == '__main__':
    try:
        main()
    except urllib.error.HTTPError as e:
        sys.exit(f'GitHub refused the edit: HTTP {e.code} {e.read().decode()[:200]}')

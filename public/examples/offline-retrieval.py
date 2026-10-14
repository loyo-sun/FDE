"""教学演示：合成数据的关键词检索与范围过滤；无网络、无模型、无写操作。
运行：将两个 JSON 与本文件保存到同一目录，执行 python3 offline-retrieval.py。
此处 tenant/groups 是测试输入，不是可信身份系统；生产必须从验证后的身份获得。
"""
import json
from pathlib import Path


def retrieve(documents, *, tenant, groups, device, query):
    if not device or not query.strip():
        return []
    allowed = [d for d in documents if d['active'] and d['tenant'] == tenant
               and d['device'] == device and set(d['groups']).intersection(groups)]
    # Deliberately simple substring matching; not semantic retrieval or generation.
    return sorted(d['id'] for d in allowed
                  if any(term.casefold() in query.casefold() for term in d['terms']))


def main():
    base = Path(__file__).resolve().parent
    documents = json.loads((base / 'ticket-fixtures.json').read_text())['documents']
    cases = json.loads((base / 'evaluation-seed.json').read_text())['cases']
    failures = []
    for case in cases:
        actual = retrieve(documents, **{k: case[k] for k in ('tenant', 'groups', 'device', 'query')})
        if actual != case['expected']:
            failures.append({'id': case['id'], 'expected': case['expected'], 'actual': actual})
    print(json.dumps({'cases': len(cases), 'passed': len(cases) - len(failures),
                      'failures': failures, 'scope': 'offline keyword filtering only'},
                     ensure_ascii=False, indent=2))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()

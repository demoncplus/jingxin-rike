import json, re
from pathlib import Path

root = Path(__file__).parent
ok = True

# 1) JSON 文件解析校验
for p in sorted(root.rglob('*.json')):
    try:
        json.loads(p.read_text(encoding='utf-8'))
        print('JSON OK   %s' % p.relative_to(root))
    except Exception as e:
        ok = False
        print('JSON FAIL %s: %s' % (p, e))

# 2) JS 语法粗校验：去注释和字符串后检查括号配对
BLOCK = re.compile(r'/\*.*?\*/', re.S)
LINE = re.compile(r'(^|\s)//[^\n]*', re.M)
DQ = re.compile(r'"(?:\\.|[^"\\])*"')
SQ = re.compile(r"'(?:\\.|[^'\\])*'")
BT = re.compile(r'`(?:\\.|[^`\\])*`')

def strip_js(src):
    src = BLOCK.sub('', src)
    src = LINE.sub(r'\1', src)
    src = DQ.sub('""', src)
    src = SQ.sub("''", src)
    src = BT.sub('``', src)
    return src

js_files = sorted(root.rglob('*.js'))
for p in js_files:
    if p.name == '.validate.py':
        continue
    s = strip_js(p.read_text(encoding='utf-8'))
    bad = False
    for a, b in [('(', ')'), ('[', ']'), ('{', '}')]:
        if s.count(a) != s.count(b):
            ok = False
            bad = True
            print('JS FAIL   %s: unbalanced %s%s (%d vs %d)' % (p.relative_to(root), a, b, s.count(a), s.count(b)))
            break
    if not bad:
        print('JS OK     %s' % p.relative_to(root))

# 3) 小程序 require 路径存在性
mp = root / 'miniprogram'
for p in mp.rglob('*.js'):
    src = p.read_text(encoding='utf-8')
    for m in re.finditer(r"require\('([^']+)'\)", src):
        rel = m.group(1)
        if rel.startswith('.'):
            t = (p.parent / rel).resolve()
            if not (t.with_suffix('.js').exists() or t.is_dir()):
                ok = False
                print('REQUIRE FAIL %s: %s' % (p.relative_to(root), rel))

# 4) WXML 里引用的组件/页面路径存在性
for p in mp.rglob('*.json'):
    try:
        data = json.loads(p.read_text(encoding='utf-8'))
    except Exception:
        continue
    for comp, path in (data.get('usingComponents') or {}).items():
        if not (mp / (path.lstrip('/') + '.json')).exists():
            ok = False
            print('COMPONENT FAIL %s: %s' % (p.relative_to(root), path))

print('RESULT: ' + ('ALL PASS' if ok else 'HAS ERRORS'))

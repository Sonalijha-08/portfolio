from pathlib import Path
p = Path('style.css')
text = p.read_text(encoding='utf-8')
replacements = {
    'rgba(201,168,76,.6)': 'rgba(255,92,144,.6)',
    'rgba(201,168,76,.45)': 'rgba(255,92,144,.45)',
    'rgba(201,168,76,.3)': 'rgba(255,92,144,.3)',
    'rgba(201,168,76,.22)': 'rgba(255,92,144,.22)',
    'rgba(201,168,76,.035)': 'rgba(255,92,144,.035)',
    'rgba(201,168,76,.08)': 'rgba(255,92,144,.08)',
    'rgba(201,168,76,.25)': 'rgba(255,92,144,.25)',
    'rgba(201,168,76,.05)': 'rgba(255,92,144,.05)',
    'rgba(201,168,76,.15)': 'rgba(255,92,144,.15)',
    'rgba(201,168,76,.4)': 'rgba(255,92,144,.4)',
    'rgba(201,168,76,.025)': 'rgba(255,92,144,.025)',
    'rgba(201,168,76,.07)': 'rgba(255,92,144,.07)',
    'rgba(201,168,76,.02)': 'rgba(255,92,144,.02)',
}
for old, new in replacements.items():
    text = text.replace(old, new)
p.write_text(text, encoding='utf-8')
print('replaced')

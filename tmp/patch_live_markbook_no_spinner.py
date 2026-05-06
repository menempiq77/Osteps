from pathlib import Path
import shutil


path = Path('/var/www/osteps/Osteps/src/app/dashboard/students/reports/page.tsx')
content = path.read_text()

backup_path = Path(str(path) + '.bak_no_spinner_20260427')
if not backup_path.exists():
    shutil.copyfile(path, backup_path)

old = """                                <input\n                                  autoFocus\n                                  type=\"number\"\n                                  value={editingValue}\n                                  min={0}\n                                  max={col.allocatedMarks}\n                                  onChange={(e) => setEditingValue(e.target.value)}\n                                  onBlur={() => commitEdit(student.student_id, col)}\n"""

new = """                                <input\n                                  autoFocus\n                                  type=\"text\"\n                                  inputMode=\"decimal\"\n                                  pattern=\"[0-9]*[.]?[0-9]*\"\n                                  value={editingValue}\n                                  min={0}\n                                  max={col.allocatedMarks}\n                                  onChange={(e) => {\n                                    const nextValue = e.target.value;\n                                    if (nextValue === \"\" || /^\\d*\\.?\\d*$/.test(nextValue)) {\n                                      setEditingValue(nextValue);\n                                    }\n                                  }}\n                                  onBlur={() => commitEdit(student.student_id, col)}\n"""

if old not in content:
    raise SystemExit('Expected markbook input snippet not found')

content = content.replace(old, new, 1)
path.write_text(content)
print('Patched live markbook input to text/numeric mode')
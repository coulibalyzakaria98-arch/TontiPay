
def check_balance(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    for i, char in enumerate(content):
        if char == '{':
            stack.append(('{', i))
        elif char == '}':
            if not stack:
                print(f"Extra '}}' at index {i}")
            else:
                stack.pop()
        elif char == '(':
            stack.append(('(', i))
        elif char == ')':
            if not stack:
                print(f"Extra ')' at index {i}")
            else:
                op, pos = stack.pop()
                if op != '(':
                    print(f"Mismatched ')' at index {i}, matches '{op}' from index {pos}")
    
    while stack:
        op, pos = stack.pop()
        print(f"Unclosed '{op}' from index {pos}")

check_balance('frontend-new/src/pages/AdminDashboard.jsx')

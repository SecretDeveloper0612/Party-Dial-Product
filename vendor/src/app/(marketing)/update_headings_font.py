import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# We want to replace 'font-pd' with 'font-sf' inside className strings of h1, h2, h3, h4, h5, h6 elements.
# Since it might be tricky to parse JSX perfectly with regex, we can just replace 'font-pd' with 'font-sf' on lines that contain `<h1`, `<h2`, `<h3`, `<h4`, `<h5`, `<h6`.
# Actually, the user wants "SF Pro Display Semi Bold".
# We should replace `font-pd` with `font-sf font-semibold` if it's not already font-semibold, but most of them are.
# Let's just do a safer approach:
lines = content.split('\n')
for i in range(len(lines)):
    line = lines[i]
    if any(tag in line for tag in ['<h1', '<h2', '<h3', '<h4', '<h5', '<h6']):
        # Replace font-pd with font-sf
        line = line.replace('font-pd', 'font-sf')
        # Ensure it has font-semibold
        if 'font-semibold' not in line and 'font-' in line:
            # We don't want to double add, but wait, usually they have font-semibold, font-bold, or font-medium.
            # The user wants Semi Bold, so let's enforce font-semibold.
            line = line.replace('font-medium', 'font-semibold')
            line = line.replace('font-bold', 'font-semibold')
            line = line.replace('font-normal', 'font-semibold')
            if 'font-semibold' not in line:
                line = line.replace('font-sf', 'font-sf font-semibold')
        lines[i] = line

content = '\n'.join(lines)

with open(file_path, 'w') as f:
    f.write(content)

print("Updated headings to font-sf font-semibold.")

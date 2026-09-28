import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Isolate the Bento Grid section
start_marker = '{/* Bento Grid */}'
end_marker = '{/* Bottom CTA */}'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    bento_section = content[start_idx:end_idx]
    
    # Remove col-span classes to make all cards equal width (1 column each in a 3-column grid)
    bento_section = bento_section.replace('md:col-span-2 ', '')
    bento_section = bento_section.replace('md:col-span-1 ', '')
    
    # Put it back
    content = content[:start_idx] + bento_section + content[end_idx:]
    
    with open(file_path, 'w') as f:
        f.write(content)
        
    print("Cards converted to equal 3-column grid.")
else:
    print("Could not find boundaries")

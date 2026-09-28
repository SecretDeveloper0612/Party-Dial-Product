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
    
    # Scale down sizes
    bento_section = bento_section.replace('auto-rows-[400px]', 'auto-rows-[300px]')
    bento_section = bento_section.replace('gap-6 lg:gap-8', 'gap-4 lg:gap-6')
    bento_section = bento_section.replace('p-8 md:p-10', 'p-6')
    bento_section = bento_section.replace('p-8 pb-0', 'p-6 pb-0')
    bento_section = bento_section.replace('min-h-[250px]', 'min-h-[140px]')
    bento_section = bento_section.replace('pt-8', 'pt-4')
    bento_section = bento_section.replace('w-12 h-12', 'w-10 h-10')
    bento_section = bento_section.replace('size={24}', 'size={20}')
    bento_section = bento_section.replace('mb-6', 'mb-4')
    bento_section = bento_section.replace('mb-3', 'mb-2')
    bento_section = bento_section.replace('text-2xl', 'text-lg')
    bento_section = bento_section.replace('text-xl', 'text-lg')
    bento_section = bento_section.replace('text-[11px]', 'text-[9px]')
    bento_section = bento_section.replace('text-sm', 'text-xs')
    bento_section = bento_section.replace('p-6 md:p-8', 'p-4 md:p-6')
    bento_section = bento_section.replace('p-6 md:p-10 pt-16', 'p-4 md:p-6 pt-8')
    bento_section = bento_section.replace('min-h-[250px]', 'min-h-[160px]')
    
    # Put it back
    content = content[:start_idx] + bento_section + content[end_idx:]
    
    with open(file_path, 'w') as f:
        f.write(content)
        
    print("Bento grid scaled down.")
else:
    print("Could not find boundaries")

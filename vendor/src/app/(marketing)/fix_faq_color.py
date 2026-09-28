import re

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# Extract the FAQ section
start_marker = '{/* 11. FAQ - 2-COLUMN IMAGE DESIGN */}'
end_marker = '{/* 12. FINAL CTA - PREMIUM DARK SHOWCASE */}'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    faq_section = content[start_idx:end_idx]
    
    # Replacements
    faq_section = faq_section.replace('text-amber-400', 'text-[#F43F5E]')
    faq_section = faq_section.replace('bg-amber-400 mb-8', 'bg-[#F43F5E] mb-8')
    faq_section = faq_section.replace('ring-amber-400/20', 'ring-[#F43F5E]/20')
    faq_section = faq_section.replace('bg-amber-400 text-slate-900', 'bg-[#F43F5E] text-white')
    
    # Update the content
    content = content[:start_idx] + faq_section + content[end_idx:]
    
    with open(file_path, 'w') as f:
        f.write(content)
    
    print("Fixed FAQ colors.")
else:
    print("Could not find FAQ section.")

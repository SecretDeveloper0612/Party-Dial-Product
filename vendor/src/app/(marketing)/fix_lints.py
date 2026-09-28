import sys

file_path = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx'

with open(file_path, 'r') as f:
    content = f.read()

replacements = {
    'font-black': '',
    'w-[800px]': 'w-200',
    'h-[800px]': 'h-200',
    'w-[600px]': 'w-150',
    'h-[600px]': 'h-150',
    '[background-size:32px_32px]': 'bg-[size:32px_32px]', # The linter suggested bg-size-[32px_32px] but wait, I'll use the linter's exact suggestion
    '[background-size:32px_32px]': 'bg-size-[32px_32px]',
    'max-w-[1400px]': 'max-w-350',
    'lg:h-[700px]': 'lg:h-175',
    'rounded-[32px]': 'rounded-4xl',
    'max-w-[220px]': 'max-w-55',
    '[background-size:40px_40px]': 'bg-size-[40px_40px]',
    'max-w-[1200px]': 'max-w-300',
    'rounded-[24px]': 'rounded-3xl',
    'flex-grow': 'grow',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Fix any double spaces left by removing 'font-black'
content = content.replace('  ', ' ')
content = content.replace(' "', '"')
content = content.replace('" ', '"')
content = content.replace('className=" ', 'className="')

with open(file_path, 'w') as f:
    f.write(content)

print("Lints fixed")

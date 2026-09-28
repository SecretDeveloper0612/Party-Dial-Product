const fs = require('fs');
const file = '/Users/haldwani/Documents/Working/party_dial/vendor/src/app/(marketing)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace font-black in headings with font-semibold font-pd
content = content.replace(/<(h[1-6])[^>]*className="([^"]*)"/g, (match, tag, classes) => {
    let newClasses = classes.replace(/\bfont-black\b/g, 'font-semibold font-pd');
    newClasses = newClasses.replace(/\bfont-bold\b/g, 'font-semibold font-pd');
    if (!newClasses.includes('font-semibold')) {
        newClasses += ' font-semibold';
    }
    if (!newClasses.includes('font-pd')) {
        newClasses += ' font-pd';
    }
    // Clean up duplicates
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return `<${tag} className="${newClasses}"`;
});

// Replace font-medium, font-bold, etc in <p> with font-normal font-pd
content = content.replace(/<p[^>]*className="([^"]*)"/g, (match, classes) => {
    let newClasses = classes.replace(/\bfont-medium\b/g, 'font-normal font-pd');
    newClasses = newClasses.replace(/\bfont-bold\b/g, 'font-normal font-pd');
    if (!newClasses.includes('font-normal')) {
        newClasses += ' font-normal';
    }
    if (!newClasses.includes('font-pd')) {
        newClasses += ' font-pd';
    }
    // Clean up duplicates
    newClasses = [...new Set(newClasses.split(' '))].join(' ');
    return match.replace(classes, newClasses);
});

fs.writeFileSync(file, content);
console.log('Fonts updated successfully!');

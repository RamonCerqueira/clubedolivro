const fs = require('fs');

const files = [
  'C:/Users/Usuario/Desktop/PROJETOS/RAMON/clubedolivro/frontend/src/app/dashboard/page.tsx',
  'C:/Users/Usuario/Desktop/PROJETOS/RAMON/clubedolivro/frontend/src/components/features/FeedCard.tsx'
];

const replacements = {
  'text-white': 'text-slate-900 dark:text-white',
  'text-neutral-200': 'text-slate-800 dark:text-neutral-200',
  'text-neutral-300': 'text-slate-700 dark:text-neutral-300',
  'text-neutral-400': 'text-slate-600 dark:text-neutral-400',
  'text-neutral-500': 'text-slate-500 dark:text-neutral-500',
  'text-neutral-600': 'text-slate-500 dark:text-neutral-600',
  'bg-white/10': 'bg-slate-200 dark:bg-white/10',
  'bg-white/5': 'bg-slate-100 dark:bg-white/5',
  'bg-white/2': 'bg-white dark:bg-white/2',
  'bg-white/1': 'bg-slate-50 dark:bg-white/1',
  'border-white/10': 'border-slate-300 dark:border-white/10',
  'border-white/5': 'border-slate-200 dark:border-white/5',
  'bg-black/50': 'bg-slate-200 dark:bg-black/50',
  'bg-black/40': 'bg-slate-100 dark:bg-black/40',
  'shadow-black/50': 'shadow-slate-200 dark:shadow-black/50'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // We need to be careful with overlaps, so we sort keys by length descending
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

  keys.forEach(key => {
    // We use a regex to ensure we match whole tailwind classes
    // e.g. text-white doesn't match text-white/40 if we handle / correctly
    // But since / is a boundary, \b doesn't work well for /
    // Let's just use string replace with spaces/quotes boundaries if needed, or a specific regex
    const val = replacements[key];
    
    // We only replace if the string is NOT already followed by a / (like text-white/40) or part of another string.
    // To be safe, we match key preceded by space or quote, and followed by space or quote.
    const regex = new RegExp(`(?<=[ "'\`])${key.replace(/\//g, '\\/')}(?=[ "'\`])`, 'g');
    content = content.replace(regex, val);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('No changes in ' + file);
  }
});

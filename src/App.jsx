function highlight(code) {
  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  let out = escape(code)

  // Use placeholder tokens so replacements don't overlap and corrupt each other
  const tokens = []
  const stash = (html) => {
    tokens.push(html)
    return `\u0000${tokens.length - 1}\u0000`
  }

  // 1. Comments FIRST — before strings, so "//" inside strings isn't matched
  out = out.replace(/(\/\/[^\n]*)/g, (m) =>
    stash(`<span class="tok-comment">${m}</span>`)
  )

  // 2. Strings
  out = out.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, (m) =>
    stash(`<span class="tok-string">${m}</span>`)
  )

  // 3. Keywords
  out = out.replace(
    /\b(const|let|var|function|return|import|from|export|default|if|else|useState|useEffect|prev)\b/g,
    (m) => stash(`<span class="tok-keyword">${m}</span>`)
  )

  // 4. Numbers
  out = out.replace(/\b(\d+)\b/g, (m) =>
    stash(`<span class="tok-number">${m}</span>`)
  )

  // 5. JSX tags
  out = out.replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9]*)/g, (m) =>
    stash(`<span class="tok-tag">${m}</span>`)
  )

  // Restore all tokens at the end — clean, no nested corruption
  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)])

  return out
}
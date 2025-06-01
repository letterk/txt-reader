export async function slugify(text) {
  const { pinyin } = await import('pinyin-pro')

  const pinyinText = pinyin(text, { toneType: 'none' })

  let slug = pinyinText.toLowerCase()

  slug = slug.replace(/\s+/g, '-')

  slug = slug.replace(/[^\w-]+/g, '')

  slug = slug.replace(/-+/g, '-')

  slug = slug.replace(/^-+|-+$/g, '')

  return slug
}

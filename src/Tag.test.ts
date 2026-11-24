import { expect, test } from 'vitest'
import Tag from './Tag.js'


test('img', () => {
    const res = new Tag('img', {src: 'public/img.png', alt: 'img'}).toString()
    expect(res).toBe('<img src="public/img.png" alt="img"/>')
})

test('div', () => {
    expect(new Tag('div', {}).toString()).toBe('<div></div>')
})

test('p', () => {
    expect(new Tag('p1', {}, "abc").toString()).toBe('<p1>abc</p1>')
})

test('div h1 h2', () => {
    const h1 = new Tag('h1', {}, "abc");
    const h2 = new Tag('h2', {}, "def");
    const div = new Tag('div', {}, [h1, h2])
    expect(div.toString()).toBe('<div>\n  <h1>abc</h1>\n  <h2>def</h2>\n</div>')
})
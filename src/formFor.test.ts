import { test, expect } from "vitest";
import formFor from "./formFor.js";

test('default submit with labels', () => {
    const template = { name: 'rob', job: 'hexlet', gender: 'm' };
    const form = formFor(template, {}, (f) => {
        f.submit();
    });
    expect(form).toBe(
        '<form action="#" method="post">\n' +
        '  <label for="name-input">name</label>\n' +
        '  <input id="name-input" name="name" type="text" value="rob"/>\n' +
        '  <label for="job-input">job</label>\n' +
        '  <input id="job-input" name="job" type="text" value="hexlet"/>\n' +
        '  <label for="gender-input">gender</label>\n' +
        '  <input id="gender-input" name="gender" type="text" value="m"/>\n' +
        '  <input id="submit-button" type="submit" value="Save"/>\n' +
        '</form>'
    );
});
test('submit value', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, (f) => {f.submit("Send")});
    expect(form).toContain('<input id="submit-button" type="submit" value="Send"/>');
    expect(form).not.toContain('<input id="submit-button" type="submit" value="Save"/>');
});

test('default method and action', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('method="post"');
    expect(form).toContain('action="#"');
});

test('with url', () => {
    const template = { name: 'rob', job: 'hexlet', gender: 'm' };
    const form = formFor(template, { url: '/users' }, () => {});
    expect(form).toContain('action="/users"');
});

test('with method', () => {
    const template = { name: 'rob' };
    const form = formFor(template, { method: 'get' }, () => {});
    expect(form).toContain('method="get"');
});

test('textarea', () => {
    const template = { name: 'rob', job: 'hexlet' };
    const form = formFor(template, {}, (f) => {
        f.input('job', { as: 'textarea'});
    });
    console.log(form)
    expect(form).toContain('<textarea id="job-input" name="job" cols="20" rows="40">hexlet</textarea>');
    expect(form).not.toContain('<input id="job-input" name="job"');
});

test('input no options', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, (f) => {
        f.input('name');
    });
    expect(form).toContain('<input id="name-input" name="name" type="text" value="rob"/>');
});

test('wrong field', () => {
    const template = { name: 'rob' };
    expect(() => {
        formFor(template, {}, (f) => {
            f.input('age');
        });
    }).toThrow("Field 'age' does not exist in the template.");
});

test('input type=number', () => {
    const template = { age: 42 };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('<input id="age-input" name="age" type="number" value="42"/>');
});

test('input type=checkbox', () => {
    const template = { active: true };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('<input id="active-input" name="active" type="checkbox" value="true"/>');
});

test('render fields not featured in f', () => {
    const template = { name: 'rob', job: 'hexlet' };
    const form = formFor(template, {}, (f) => {
        f.input('name');
    });
    expect(form).toContain('name="name"');
    expect(form).toContain('name="job"');
});
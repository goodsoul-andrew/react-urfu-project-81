import { test, expect } from "vitest";
import formFor from "./formFor.js";

test('default submit with labels', () => {
    const template = { name: 'rob', job: 'hexlet', gender: 'm' };
    const form = formFor(template, {}, (f) => { f.submit(); });
    expect(form).toBe(
        '<form method="post" action="#">' +
        '<label for="name">Name</label>' +
        '<input name="name" type="text" value="rob">' +
        '<label for="job">Job</label>' +
        '<input name="job" type="text" value="hexlet">' +
        '<label for="gender">Gender</label>' +
        '<input name="gender" type="text" value="m">' +
        '<input type="submit" value="Save">' +
        '</form>'
    );
});

test('submit value', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, (f) => { f.submit("Send"); });
    expect(form).toContain('<input type="submit" value="Send">');
    expect(form).not.toContain('<input type="submit" value="Save">');
});

test('default method and action', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('method="post"');
    expect(form).toContain('action="#"');
});

test('with url', () => {
    const template = { name: 'rob' };
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
        f.input('job', { as: 'textarea' });
    });
    expect(form).toContain('<textarea cols="20" rows="40" name="job">hexlet</textarea>');
    expect(form).not.toContain('<input name="job"');
});

test('input no options', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, (f) => { f.input('name'); });
    expect(form).toContain('<input name="name" type="text" value="rob">');
});

test('wrong field', () => {
    const template = { name: 'rob' };
    expect(() => {
        formFor(template, {}, (f) => { f.input('age'); });
    }).toThrow("Field 'age' does not exist in the template.");
});

test('input type=number', () => {
    const template = { age: 42 };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('<input name="age" type="number" value="42">');
});

test('input type=checkbox', () => {
    const template = { active: true };
    const form = formFor(template, {}, () => {});
    expect(form).toContain('<input name="active" type="checkbox" value="true">');
});

test('render fields not featured in f', () => {
    const template = { name: 'rob', job: 'hexlet' };
    const form = formFor(template, {}, (f) => { f.input('name'); });
    expect(form).toContain('name="name"');
    expect(form).toContain('name="job"');
});

test('label with text and attributes', () => {
    const template = { name: 'rob' };
    const form = formFor(template, {}, (f) => {
        f.input('name', { label: 'User', labelHtml: { class: 'form-label', id: 'name-label' } });
        f.submit('Ok');
    });
    expect(form).toBe(
        '<form method="post" action="#">' +
        '<label for="name" class="form-label" id="name-label">User</label>' +
        '<input name="name" type="text" value="rob">' +
        '<input type="submit" value="Ok">' +
        '</form>'
    );
});
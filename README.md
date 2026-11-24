# Генератор форм на Typescript

[![hexlet-check](https://github.com/goodsoul-andrew/react-urfu-project-81/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/goodsoul-andrew/react-urfu-project-81/actions)

Библиотека, с помощью которой удобно создавать формы в шаблонах сайтов. Она заметно сокращает код описания формы за счет автоматической обработки ошибок и различных контролов.

Учебный проект Хекслета: https://ru.hexlet.io/
Как это должно работать: https://files.hexlet.app/a/100lcl

## Стек

- JavaScript

## Установка

<!-- Опишите установку: клонирование, зависимости, переменные окружения -->

```bash
git clone https://github.com/goodsoul-andrew/react-urfu-project-81.git
cd react-urfu-project-81
```

## Использование

```typescript
import formFor from './formFor.ts';

const template = {
    name: 'rob',
    job: 'hexlet',
    gender: 'm',
    age: 30,
    active: true,
};
const form = formFor(
    template,
    { url: '/users', method: 'post' },
    (f) => {
        f.input('name');
        f.input('job', { as: 'textarea' });
    },
);
```
```html
<form action="/users" method="post">
  <input name="name" type="text" value="rob"/>
  <textarea name="job">hexlet</textarea>
  <input name="gender" type="text" value="m"/>
  <input name="age" type="number" value="30"/>
  <input name="active" type="checkbox" value="true"/>
</form>
```

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.

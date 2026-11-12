# Forms and Validation in React

WEBD 245, Front End Web Development. The sign up form from the lecture, as a
project you can run.

The code in `src/SignUpForm.jsx` and `src/examples/EmailField.jsx` is exactly
the code on the slides. Nothing has been added to it and nothing has been
left out.

## Install and run

You need Node.js. Check with `node -v`. If that prints a version number you
are ready.

Open a terminal in this folder and run:

```
npm install
npm run dev
```

`npm install` downloads the packages the project needs. It takes a minute the
first time and you only do it once.

`npm run dev` starts the development server and prints an address:

```
  ➜  Local:   http://localhost:5173/
```

Open that address in your browser. The page reloads on its own every time you
save a file.

Press Ctrl and C in the terminal to stop the server.

To make a finished copy for hosting, run `npm run build`. It writes a `dist`
folder. You do not need it to work through the example.

## What is in the project

| File | Slides | What it is |
| --- | --- | --- |
| `src/SignUpForm.jsx` | 6 to 10 | The whole example. This is what runs. |
| `src/examples/EmailField.jsx` | 5 | One controlled input on its own |
| `public/browser-validation.html` | 4 | The same form in plain HTML, no React |
| `src/App.jsx` | 2 | The page heading and the form |
| `src/index.css` | 11 | Styling only. No rule here decides anything. |

`EmailField.jsx` is not wired into the page. To look at it, open `src/App.jsx`
and swap `SignUpForm` for `EmailField`.

`browser-validation.html` is served as it is. With the server running, open
`http://localhost:5173/browser-validation.html`. Press Sign up and read the
message. The browser wrote it, not you. That is the slide 4 point, and it is
the reason the React form turns this off.

## How the code works

`SignUpForm.jsx` is five parts, in the order the slides introduced them.

### Part 1: the rules

```
validateEmail(email)      validatePassword(password)
```

Each rule takes one value and returns a string. The string is the message to
show. An empty string means there is nothing wrong.

That single convention is what makes the rest simple. There is no true or
false to translate into words later, and no separate list of messages to keep
in step with the rules. The rule and its wording live in the same place.

`validateEmail` has two rules in it and the order matters. Empty is checked
first, so someone who has typed nothing is told to enter an address rather
than being told their address needs an at sign.

Checking only for an at sign looks rough next to a long pattern, but real
email addresses vary far more than most patterns allow, and a strict pattern
turns away valid addresses. The only complete check is sending mail to it.

### Part 2: the state

Four pieces:

| State | What it holds |
| --- | --- |
| `email` | What is in the email box |
| `password` | What is in the password box |
| `errors` | `{ email, password }`, the message for each field right now |
| `submitted` | Whether the form has gone through |

`email` and `password` are what make the inputs controlled. The value in each
box comes from state, and every keystroke puts the new text back into state.
An input with a `value` and no `onChange` will not let you type, and React
says so in the Console:

```
You provided a `value` prop to a form field without an `onChange` handler.
This will render a read-only field.
```

`errors` is an object rather than two separate pieces of state so that
`handleSubmit` can replace both messages in a single call.

### Part 3: checking on submit

`handleSubmit` does five things in order.

1. `event.preventDefault()` stops the browser submitting the form the old way.
   Without it the page reloads and every piece of state is gone.
2. Runs both rules on the current values.
3. Puts both results into `errors`, so every message appears at once rather
   than one at a time.
4. If both results are empty strings, sets `submitted` to true.
5. Otherwise nothing else happens, and the messages stay on screen.

The check is `emailError === "" && passwordError === ""`. Both have to be
empty. It reads the results it just calculated rather than reading `errors`,
because a state update is not applied immediately and `errors` still holds
the previous messages at that moment.

Below the handler:

```
if (submitted) {
  return <p role="status">Account created. Welcome!</p>;
}
```

This returns early, so once the form has gone through the form itself is no
longer rendered. `role="status"` is what makes a screen reader announce the
confirmation when it appears. Success needs feedback as much as failure does.

### Part 4 and Part 5: the fields

Each field is the same five lines of wiring.

| Attribute | What it does |
| --- | --- |
| `htmlFor` and `id` | Join the label to the box. Clicking the label focuses the box. |
| `value` | The box shows what is in state. |
| `onChange` | Every keystroke puts the new text into state. |
| `onBlur` | Runs that field's rule when the user leaves it. |
| `aria-invalid` | Marks the box itself as wrong, not just the text under it. |
| `aria-describedby` | Points at the message, so it is read out with the field. |

`onBlur` is the checking strategy. A rule runs when the user leaves a field,
which is the first moment they have finished with it. Checking on every
keystroke instead would tell them a half typed address is wrong, which it
always is until the instant it is right.

`onBlur` spreads the existing errors and replaces one key:

```
setErrors({ ...errors, email: validateEmail(email) })
```

Without the spread, checking the email would wipe out the password message.

`aria-describedby` points at the message paragraph whether or not there is a
message in it. An empty paragraph describes nothing, so there is nothing to
announce until a rule writes into it. Each message sits directly under its
own field, which is where someone looks after being told something is wrong.

`noValidate` on the form turns off the browser's own checking. Both sets of
messages would otherwise be in play, and the browser's wording cannot be
changed. Note that `type="email"` is still on the input, so the field still
gets the right keyboard on a phone.

## A note on the stylesheet

`src/index.css` makes a bad field show a thicker red border. It hangs that on
the attribute the component already sets:

```
input[aria-invalid="true"] { ... }
```

The stylesheet and the screen reader are reading the same attribute, so the
visible state and the announced state cannot drift apart. There is no second
`isInvalid` class to remember to add.

The border is in addition to the message, never instead of it. Colour alone
is not readable to everyone, so the text does the work and the border
reinforces it.

## What is not in here

The lecture also covered things this example does not do, on purpose.

- **Server side checking.** The browser can be bypassed, so everything has to
  be checked again on the server. There is no server in this project.
- **Log in.** A failed log in gets one message that does not say which of the
  two was wrong, so an attacker cannot learn which email addresses exist.

## References

- React: the `<input>` component
- MDN: Client-side form validation
- W3C WAI: Forms tutorial, user notifications
- Nielsen Norman Group: Reporting errors in forms
- OWASP: Authentication Cheat Sheet

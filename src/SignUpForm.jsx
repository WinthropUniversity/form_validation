// Slides 6 to 10. The five parts of the lecture example, in one file.

import { useState } from "react";

// Part 1: the rules.
// Each rule takes one value and returns a message, or "" when it is fine.

function validateEmail(email) {
  if (email === "") {
    return "Enter your email address.";
  }
  if (!email.includes("@")) {
    return "Enter an email address like name@example.com.";
  }
  return "";
}

function validatePassword(password) {
  if (password.length < 8) {
    return "Use at least 8 characters.";
  }
  return "";
}

export default function SignUpForm() {
  // Part 2: the state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  // Part 3: checking on submit
  function handleSubmit(event) {
    event.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
    if (emailError === "" && passwordError === "") {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return <p role="status">Account created. Welcome!</p>;
  }

  // Part 4: the email field
  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setErrors({ ...errors, email: validateEmail(email) })}
        aria-invalid={errors.email !== ""}
        aria-describedby="email-error"
      />
      <p id="email-error">{errors.email}</p>

      <label htmlFor="password">Password (at least 8 characters)</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setErrors({ ...errors, password: validatePassword(password) })}
        aria-invalid={errors.password !== ""}
        aria-describedby="password-error"
      />
      <p id="password-error">{errors.password}</p>
      <button type="submit">Sign up</button>
    </form>
  );
}
